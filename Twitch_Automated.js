const querystring = require('querystring');
const { curly } = require('node-libcurl');
global.__basedir = __dirname;
global.code='';
global.foundatoken=false;
global.foundrtoken=false;
const urlp = require('url');
const path = require('path');
const tls = require('tls');
const http = require('http');
const fs = require('fs');
const puppeteer = require('puppeteer');
const yesno = require('yesno');
const url = 'http://curl.haxx.se/ca/cacert.pem'; 
const filePath = path.join(__basedir, 'cacert.pem'); 
const readline = require('readline');
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}   
async function processLineByLine() {
  const fileStream = fs.createReadStream(path.join(__basedir, '.env'));
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  for await (const line of rl) {
    if(line.includes('TWITCH_ACCESS_TOKEN')){
		fs.readFile(path.join(__basedir, '.env'), 'utf8', function(err, data) {
			let searchString1 = 'TWITCH_ACCESS_TOKEN';
			let re1 = new RegExp('^.*' + searchString1 + '.*$', 'gm');
			let formatted1 = data.replace(re1, 'TWITCH_ACCESS_TOKEN=' + access_token);

		fs.writeFile(path.join(__basedir, '.env'), formatted1, 'utf8', function(err) {
			if (err) return console.log(err);
			});
		});
	  foundatoken=true;	
      await sleep(1000);
    }
	if(line.includes('TWITCH_REFRESH_TOKEN')){
		fs.readFile(path.join(__basedir, '.env'), 'utf8', function(err, data) {
			let searchString2 = 'TWITCH_REFRESH_TOKEN';
			let re2 = new RegExp('^.*' + searchString2 + '.*$', 'gm');
			let formatted2 = data.replace(re2, 'TWITCH_REFRESH_TOKEN=' + refresh_token);
		fs.writeFile(path.join(__basedir, '.env'), formatted2, 'utf8', function(err) {
			if (err) return console.log(err);
			});
		});
	  foundatoken=true;	
      await sleep(1000);
    }
}
if (foundatoken==false){
		fs.appendFile(path.join(__basedir, '.env'), "\n" + 'TWITCH_ACCESS_TOKEN=' + access_token, function (err) {
		if (err) {
    // append failed
		} else {
    // done
		}
		})
	}
if (foundrtoken==false){
		fs.appendFile(path.join(__basedir, '.env'), "\n" + 'TWITCH_REFRESH_TOKEN=' + refresh_token, function (err) {
		if (err) {
    // append failed
		} else {
    // done
		}
		})
	}
}
fs.copyFile('dotenv','.env', (err) => { if (err) throw err;});
require('dotenv').config();
const atoken = process.env.TWITCH_ACCESS_TOKEN;
const rtoken = process.env.TWITCH_REFRESH_TOKEN;
const cid  = process.env.TWITCH_CLIENT_ID;
const csec  = process.env.TWITCH_CLIENT_SECRET;
const chan  = process.env.TWITCH_CHANNEL;
console.log(__dirname + ' d ' + __basedir);
if (( typeof cid !== 'undefined' && cid) || ( typeof csec !== 'undefined' && csec) || ( typeof chan !== 'undefined' && chan) )
{
  console.log('--Parameters from dotenv--');
  console.log('TWITCH_CLIENT_ID: ' + cid);
  console.log('TWITCH_CLIENT_SECRET: ' + csec);
  console.log('TWITCH_CHANNEL: ' + chan);
  console.log('--Getting Access Token and Refresh Token--');
const file = fs.createWriteStream(filePath);
const request = http.get(url, (response) => {response.pipe(file);});
(async () => {
const browser =  await puppeteer.launch({ headless: false , userDataDir: "./user_data"});
const page = await browser.newPage();
await page.setDefaultNavigationTimeout(0);
//Check for previous session
try {
	await page.goto('https://id.twitch.tv/oauth2/authorize?response_type=code&client_id='+cid+'&redirect_uri=http://localhost&scope=chat:edit%20chat:read', {waitUntil: 'load', timeout: 0});
	page.on('response', response => {
	const status = response.status()
	if ((status >= 300) && (status <= 399)) {
	if (response.headers()['location'].includes('localhost') == true){
		let parsedUrl = urlp.parse(response.headers()['location']);
		const object = querystring.parse(parsedUrl.query);
		code = object['code'];
		console.log('CODE: ' + code);
	}
  }
  })
	await page.waitForNavigation();
	await browser.close();
} catch (e) 
{
console.log('Session previously saved in ./user_data... Using previous session. No login needed!');
const pages = await browser.pages();
 	var x = await browser.targets();
	for(let i=0;i<x.length;i++)
	{
		var y = x[i].url();
		if((x[i].type()==='page') && (y.includes('localhost')==true))
    {
		let parsedUrl = urlp.parse(x[i].url());
		const object = querystring.parse(parsedUrl.query);
		code = object['code'];
		console.log('CODE: ' + code);
		await browser.close();
    }
	}
} 
	await sleep(2500);
    const certFilePath = path.join(__basedir, 'cacert.pem')
    const tlsData = tls.rootCertificates.join('\n')
	fs.access(certFilePath, (err) => {
    if (err) {
        console.log("The file does not exist, downloading...");
		fs.writeFileSync(certFilePath, tlsData);
    } else {
        console.log("The file exists, deleting old cacert.pem");
		fs.unlink(certFilePath, (err) => {
    if (err) {
        throw err;
    }
    console.log("File is deleted.");
});
    }
});
	await sleep(2500);
    fs.writeFileSync(certFilePath, tlsData);
  	const { statusCode, data, headers } = await curly.post('https://id.twitch.tv/oauth2/token', {postFields: querystring.stringify({ client_id: cid,client_secret: csec, code: global.code, grant_type: 'authorization_code', redirect_uri: 'http://localhost'}),
    caInfo: certFilePath,
	})
	global.access_token = data.access_token;
global.refresh_token = data.refresh_token;
processLineByLine();
await sleep(5000);
  console.log('--Parameters from dotenv--');
  console.log('TWITCH_CLIENT_ID: ' + cid);
  console.log('TWITCH_CLIENT_SECRET: ' + csec);
  console.log('TWITCH_CHANNEL: ' + chan);
  console.log('--New Parameters obtained in script--');
  console.log('TWITCH_ACCESS_TOKEN: ' + access_token);
  console.log('TWITCH_REFRESH_TOKEN: ' + refresh_token);
const ok = await yesno({
    question: 'Do you want to update dotenv?'
});
if (ok==true){
	console.log('Creating dotenv.bak...');
	fs.copyFile('dotenv','dotenv.bak', (err) => { if (err) throw err;});
	console.log('Copying .env to dotenv');
	fs.copyFile('.env','dotenv', (err) => { if (err) throw err;});
	console.log('Done! exiting ...');
	console.log('Test Twitch Notifications with: npm run test:notification');
	process.exit();
}
})(); 
}
else
{
  console.log('Twitch API not configured');
  console.log('Please register app at http://dev.twitch.tv');
  console.log('And populate TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET, and TWITCH_CHANNEL in the dotenv file');
}
