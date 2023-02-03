// Get the button and summary div elements
const summaryButton = document.getElementById("summary-button");

const summaryDiv = document.getElementById("summary");

// Function to send the request to the OpenAI API for summarization
async function getSummary() {
  // Display the loading message in the summary div
  summaryDiv.innerHTML = "Loading...";

  // Get the text of the active tab
  const activeTab = await getActiveTab();
  const pageText = activeTab.text;

  // Send the request to the OpenAI API for summarization
  const response = await axios({
    method: "post",
    url: "https://api.openai.com/v1/engines/davinci/jobs",
    headers: {
      "Content-Type": "application/json",

      Authorization:
        "Bearer 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",
    },

    data: {
      document: pageText,

      prompt: `Summarize the following text: ${pageText}`,
      max_tokens: 100,
    },
  });

  // Get the JSON data from the response
  const data = response.data;

  // Display the summarized text in the summary div
  summaryDiv.innerHTML = data.choices[0].text;
}

// Function to get the text of the active tab
async function getActiveTab() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "getText" }, (response) => {
        resolve(response);
      });
    });
  });
}

// Add an event listener to the button to trigger the summarization process
summaryButton.addEventListener("click", getSummary);
