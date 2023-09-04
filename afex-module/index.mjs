import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
	DynamoDBDocumentClient,
	ScanCommand,
	PutCommand,
	GetCommand,
	DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import https from "https";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const tableName = "afex";
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const VIMEO_CLIENT_ID = process.env.VIMEO_CLIENT_ID;
const VIMEO_CLIENT_SECRET = process.env.VIMEO_CLIENT_SECRET;

export const handler = async (event, context) => {
	let body;
	let statusCode = 200;
	const headers = {
		"Content-Type": "application/json",
		"Access-Control-Allow-Origin": "*",
	};

	try {
		switch (event.routeKey) {
			case "DELETE /videos/{uid}":
				await dynamo.send(
					new DeleteCommand({
						TableName: tableName,
						Key: {
							uid: event.pathParameters.uid,
						},
					})
				);
				body = `Deleted item ${event.pathParameters.uid}`;
				break;
			case "GET /video/details":
				let video_data = {}

				if (event.queryStringParameters.website == "vimeo") {
					console.log("processing vimeo");
					const options = {
						hostname: "api.vimeo.com",
						path: "/videos/" + event.queryStringParameters.uid,
						method: "GET",
						headers: {
							Authorization: 'basic ' + btoa(VIMEO_CLIENT_ID + ":" + VIMEO_CLIENT_SECRET),
						},
					};
					
					let response = await getRequest(options)
					
					if (response.error !== undefined) {
						body = {"error": "video not found"}
						break;
					}

					video_data = {
						uid: event.queryStringParameters.uid,
						title: response.name,
						desc: response.description,
						length: secondsToHMS(response.duration),
						img_url: response.pictures.sizes[2].link,
						website: "vimeo",
					};
				}
				if (event.queryStringParameters.website == "youtube") {
					const options = {
						hostname: "www.googleapis.com",
						path: "/youtube/v3/videos?id=" + event.queryStringParameters.uid + "&key=" + YOUTUBE_API_KEY + "&part=snippet,contentDetails",
						method: "GET",
						headers: {
							//Authorization: "authKey",
						},
					};
					
					let response = await getRequest(options);
						
					if (response.items.length == 0) {
						body = {"error": "video not found"}
						break;
					}

					video_data = {
						uid: event.queryStringParameters.uid,
						title: response.items[0].snippet.title,
						desc: response.items[0].snippet.description,
						length: ISO8601toDuration(response.items[0].contentDetails.duration),
						img_url: response.items[0].snippet.thumbnails.medium.url,
						website: "youtube",
					};
				}

				body = video_data
				break;
			case "GET /videos":
				body = await dynamo.send(
					new ScanCommand({ TableName: tableName })
				);
				body = body.Items;
				break;
			case "OPTIONS /videos":
				break;
			case "OPTIONS /videos/{uid}":
				break;
			case "PUT /videos":
				let requestJSON = JSON.parse(event.body);
				await dynamo.send(
					new PutCommand({
						TableName: tableName,
						Item: {
							uid: requestJSON.uid,
							title: requestJSON.title,
							desc: requestJSON.desc,
							length: requestJSON.length,
							img_url: requestJSON.img_url,
							website: requestJSON.website
						},
					})
				);
				body = `Put item ${requestJSON.uid}`;
				break;
			default:
				throw new Error(`Unsupported route: "${event.routeKey}"`);
		}
	} catch (err) {
		statusCode = 400;
		body = err.message;
		console.log(err);
	} finally {
		body = JSON.stringify(body);
	}

	return {
		statusCode,
		body,
		headers,
	};
};

async function getRequest(options) {
	return new Promise((resolve, reject) => {
		const req = https.get(options, (res) => {
			let rawData = "";

			res.on("data", (chunk) => {
				rawData += chunk;
			});

			res.on("end", () => {
				try {
					resolve(JSON.parse(rawData));
				} catch (err) {
					reject(new Error(err));
				}
			});
		});

		req.on("error", (err) => {
			reject(new Error(err));
		});
	});
}

function secondsToHMS(input) {
		var sec_num = parseInt(input, 10); // don't forget the second param
		var hours   = Math.floor(sec_num / 3600);
		var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
		var seconds = sec_num - (hours * 3600) - (minutes * 60);

		if (hours   < 10) {hours   = "0"+hours;}
		if (minutes < 10) {minutes = "0"+minutes;}
		if (seconds < 10) {seconds = "0"+seconds;}

		if(hours == 0){
			hours = "";
		}else{
			hours += ":"
		}
		return hours + minutes+':'+seconds;
}

function formatTimeUnit(input, unit){
		var index = input.indexOf(unit);
		var output = "00"
		if(index < 0){
			return output; // unit isn't in the input
		}

		if(isNaN(input.charAt(index-2))){
			return '0' + input.charAt(index-1);
		}else{
			return input.charAt(index-2) + input.charAt(index-1);
		}
}

function ISO8601toDuration(input){
		var H = formatTimeUnit(input, 'H');
		var M = formatTimeUnit(input, 'M');
		var S = formatTimeUnit(input, 'S');

		if(H == "00"){
			H = "";
		}else{
			H += ":"
		}

		return H  + M + ':' + S ;
}