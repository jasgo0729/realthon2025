import { IMessage } from "../types/chat";

export const appendMessage = async (messageData: IMessage) => {
    await fetch("http://localhost:8000/append", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(messageData)
    });
}

export const assignRoles = async (conversation_text: string, target_situation: string) => {
    let result = await fetch("http://localhost:8000/assign-roles", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json' // 필수!
      },
      body: JSON.stringify({
        conversation_text: conversation_text,
        target_situation: target_situation
      })
    }).then((res) => res.json()).then(data => {
        console.log(data);
        return data;
    });
    return result;
}

export const parseAssignedRoles = (raw_data: string) => {
    let start = raw_data.indexOf("[");
    let end = raw_data.lastIndexOf("]");
    let json_string = raw_data.substring(start, end + 1);
    return JSON.parse(json_string);
}

export const getAgentResponse = async (room_id: string) => {
    const baseUrl = 'http://localhost:8000';
    const endpoint = `/agent_response?room_id=${encodeURIComponent(room_id)}`;
    const url = `${baseUrl}${endpoint}`;
    let result = await fetch(url, {
      method: "POST"
    }).then((res) => res.json()).then(data => {
        console.log(data);
        return data;
    });
    return result;
}