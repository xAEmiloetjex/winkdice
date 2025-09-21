import * as http from "node:http"
import {exec} from "node:child_process"
import axios from "axios"

import * as de_ from 'dotenv'
de_.config()

/**
 * DONT EDIT THIS...
 */
let this_version = 4
let debug_level: 0 | 1 | 2 = 0

import { Main } from './src/main';
import { Database } from 'quickmongo';
import { crashHandler } from './src/crashHandler';

import { makerandstr } from './src/utils/common';
import * as fs from 'fs';

export const db = new Database('mongodb://127.0.0.1:27017/website');

export const sysAdminPass = makerandstr(18)

fs.writeFileSync("./sys/sysAdminPass.credential", sysAdminPass, "utf-8")
// const db = new QuickDB({ driver });

db.on('ready', () => {
	console.log("Connected to the database!")
	Loop()
})

async function db_connect() {
	// await mongoose.connect(config.uri)
	await db.connect();

	db.set('posts', [{ post_id: '<DUMMY>', likes: ['<DUMMY>'] }]);
	// db.set(
	// 	'env1',
	// 	JSON.stringify({
	// 		id: 1,
	// 		maintenance: 'false',
	// 	})
	// );
	const placeholder_bug = {
		id: 0,
		platform: 'winkdice',
		user: '[SERVER]',
		severity: 'fixed',
		title: 'PLACEHOLDER',
		description: 'PLEASE IGNORE'
	}
	// db.set("bigArray", {bugs:[{...placeholder_bug}],bugsSplit:[[{...placeholder_bug}]]})
}

db_connect()

function Loop() {
	try {
		setInterval(() => {
			axios({
				method: "get",
				url: "http://localhost:3001/versions.json"
			}).then(resp => {
				const version = this_version
				// console.log(resp.data)
				const WD_Version = resp.data.Winkdice.latest

				if (WD_Version.count > version) {
					let new_versions = []
					// console.log("Outdated client", `your version is: ${version} while the latest upstream version is: ${WD_Version.count}`)
					for (let i = version + 1; i <= WD_Version.count; i++) {
						new_versions.push(i)
					}
					console.log(new_versions)
					downloadPatches(new_versions)
					installPatches(new_versions)
				} else {
					// console.log("Client is up to date")
				}
			}).catch(e => catchErr(e, "Version server unreachable!") )
		}, 1000)
		Main()/*.then((ret) => {
			if (ret.code === "10001") return Loop()
		})*/
	} catch (e) {
		Loop()
	}
	// if ((await Main()).code === '10001') return Loop();
}

function downloadPatches(arr) {
	arr.forEach((i) => {
		const file = fs.createWriteStream(`./patches/${i}.diff`);
		const request = http.get(`http://localhost:3001/Versions/WinkDice/patches/${i}.diff`, function (response) {
			response.pipe(file);

			// after download completed close filestream
			file.on("finish", () => {
				file.close();
				console.log(`[${i}.diff]: Download Completed`);
				// installSingle(i)
			});
		});
	})
}
function installPatches(arr) {
    arr.forEach((i) => {
			const ex = exec(`pnpm run patch:server ${i}.diff`)
        ex.stdout.on("data", (_) => {
            console.log(_)
        })
        ex.stderr.on("data", (_) => {
            console.log(_)
        })
			this_version = i
    })
}


function catchErr(err, message) {
	if(debug_level == 0) return
	else if(debug_level == 1) return console.log(message)
	else if (debug_level == 2) return console.log(message,err)
	else return
}