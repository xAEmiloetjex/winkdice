import { EServStat, EGamemodes, IServerStats } from "./sharedTypes"

let n1_ping = 0

export const node1 = () => {
	n1_ping = randomPing()
	return ({
	servername: 'Velocity',
	status: EServStat.available,
	players: [
		{
			name: 'xA_Emiloetjex',
			vault: [
				{
					prefix: '',
					suffix: '',
					rank_id: 'star',
				},
				{
					rank_id: 'default',
				},
			],
			gamemode: EGamemodes.creative,
		},
        {
			name: 'IvanSoot_',
			vault: [
				{
					rank_id: 'default',
				},
			],
			gamemode: EGamemodes.creative,
		},
	],
	playercount: 2,
	max_playercount: 69,
	software: 'Velocity',
	ip: '127.0.0.1',
	port: 25577,
	ping: n1_ping,
	tps: 20,
	hostname: 'bore.pub:5952',
	version: '1.13.x - 1.20.x',
	isBehindProxy: false
})}

export const node2 = () => ({
	servername: 'LifestealSMP',
	status: EServStat.available,
	players: [
        {
			name: 'IvanSoot_',
			vault: [
				{
					rank_id: 'default',
				},
			],
			gamemode: EGamemodes.creative,
		},
	],
	playercount: 1,
	max_playercount: 100,
	software: 'PurpurMC',
	ip: '127.0.0.1',
	port: 25565,
	ping: (randomPing() + n1_ping),
	tps: randomTPS(),
	version: '1.9.x - 1.20.x',
	isBehindProxy: true
})

export const node3 = () => ({
	servername: 'Kingdoms',
	status: EServStat.available,
	players: [
		{
			name: 'xA_Emiloetjex',
			vault: [
				{
					prefix: '',
					suffix: '',
					rank_id: 'star',
				},
				{
					rank_id: 'default',
				},
			],
			gamemode: EGamemodes.creative,
		}
	],
	playercount: 1,
	max_playercount: 100,
	software: 'PurpurMC',
	ip: '127.0.0.1',
	port: 25566,
	ping: randomPing() + n1_ping,
	tps: randomTPS(),
	version: '1.9.x - 1.20.x',
	isBehindProxy: true
})

function randomPing() {
	return Math.round(Math.random() * 3500)
}

function randomTPS() {
	return Math.ceil(Math.random() * 20)
}