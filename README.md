# prednirone
Rebuild of Prednidrone, the bot for the ['thritis Discord server](https://discord.gg/AbkJa8h)

| Command | Usage | Description |
| --- | --- | --- |
| `badrheumy` | `!badrheumy` | Helps you complain about a bad rheumatologist |
| `crisis` | `!crisis <REASON>` | Alerts mods in case of an emergency (if someone is having suicidal thoughts for example, it's a private reporting mechanism) |
| `fancify` | `!fancify (yeolde|cursive|stroke|australian) message goes here` |  Makes the provided text fancy, either yeolde (`𝔶𝔢𝔬𝔩𝔡𝔢`), cursive (`𝓬𝓾𝓻𝓼𝓲𝓿𝓮`), stroke (`丂ㄒ尺ㄖҜ乇`), or australian (`uɐılɐɹʇsnɐ`) |
| `help` | `!help [command]` | Displays a list of commands with basic help, or, if supplied a command, displays detailed help for that command |
| `play` | `!play <url>` | Adds a track to the song queue, and joins your voice channel if it's not currently in a voice channel |
| `disconnect` | `!disconnect` | Kick the bot from the current voice channel, and stops any music from playing |
| `skip` | `!skip` | `Skips the currently playing song, if there are no songs left in the queue the bot disocnnects from the voice channel` |
| `volume` | `!volume <number>` | Sets the volume of the audio playback |
| `timeout` | `!timeout channel [reason]` | Temporarily hides a channel for you, if a reason is provided it gets logged |
| `say` | `!say <message>` | Makes the bot send a message |
| `lifetime` | `!lifetime [user_id_or_ping]` | Finds ho wlong the specified user has been in the server, or, if none is specified, the calling user |
| `spoonbank` | `!spoonbank <parameters>` | Various commands for the "spoon" bank (a meaningless joke currency system) |


## Running a local instance

If you want to run a local instance of prednidrone, here's some instructions

1. Clone the repository
2. Create a file called `config.json` in the main folder of the repository, and include the following. Ensure that `BOT_TOKEN` is replaced with a Discord bot token, and the roles array contains all assignable roles. 
```json
{
    "token":BOT_TOKEN,
    "prefix":"!",
    "roles":[
        ARRAY_OF_ROLE_IDS
    ]
}
```
3. Run `npm install` to ensure packages are up to date
4. Start the bot with `node server`


