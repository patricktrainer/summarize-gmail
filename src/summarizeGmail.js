const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY"

function postMessage(message) {
  const url = 'https://api.openai.com/v1/chat/completions';
  const data = {  
    "model": "gpt-3.5-turbo",
    "messages": [
      {
        "role": "system",
        "content": "You are a summary bot for summarizing email."
      },
      {
        "role": "user",
        "content": message
      }
    ],
  }

  const options = {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + OPENAI_API_KEY,
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify(data)
  };
  
  console.log(options)
  const response = UrlFetchApp.fetch(url, options);
  console.log(response.getContentText());
}

function searchGmail(query) {
  return GmailApp.search(query)
}

function main() {
  const threads = searchGmail('is:starred label:"summarize"');

  for (const thread of threads) {
    const messages = thread.getMessages();

    for (const message of messages) {
      if (message.isStarred()) {
        const msgBody = message.getPlainBody();
        postMessage(msgBody);
        // remove the star from the email
        message.unstar();
      }
    }
  }
}
