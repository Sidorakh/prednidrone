interface ReactionRole {
    emoji_id: string;
    role_id: string;
    name: string;
}
export interface ReactionMessage {
    message_id: null | string;
    reactions: ReactionRole[];
}
export interface ReactionSetup {
    roles:[
        {
            emoji_id: string;
            role_id: string;
            name: string;
        }
    ]

}
