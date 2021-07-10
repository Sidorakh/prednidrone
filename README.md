# prednirone
Rebuild of Prednidrone, the bot for the ['thritis Discord server](https://discord.gg/AbkJa8h)

| Command | Usage | Description |
| --- | --- | --- |
| `badrheumy` | `/badrheumy` | Helps you complain about a bad rheumatologist |
| `crisis` | `/crisis <REASON>` | Alerts mods in case of an emergency (if someone is having suicidal thoughts for example, it's a private reporting mechanism) |
| `fancify` | `/fancify (yeolde|cursive|stroke|australian) message goes here` |  Makes the provided text fancy, either yeolde (`𝔶𝔢𝔬𝔩𝔡𝔢`), cursive (`𝓬𝓾𝓻𝓼𝓲𝓿𝓮`), stroke (`丂ㄒ尺ㄖҜ乇`), or australian (`uɐılɐɹʇsnɐ`) |
| `help` | `/help [command]` | Displays a list of commands with basic help, or, if supplied a command, displays detailed help for that command |
| `say` | `/say <message> <channel>` | Makes the bot send a message in a specified channel |
| `lifetime` | `/lifetime [user_id_or_ping]` | Finds ho wlong the specified user has been in the server, or, if none is specified, the calling user |


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


