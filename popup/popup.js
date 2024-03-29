const WHAT_CMS_URL = "https://whatcms.org/API/Tech"
let WHAT_CMS_KEY = ""
const regex = /^[a-zA-Z0-9]{70}$/gm;

function createResultRow(name, categories) {
    let categoryItems = "";
    for (let i = 0; i < categories.length; i++) {
        categoryItems += `<span>${categories[i]}</span>`;
    }

    let row = `<tr><td>${categories.toString()}</td><td>${name}</td></tr>`;
    return row;
}

function tabulateResults(whatRes) {
    let table = "<table class='u-full-width'><thead><tr><th>Category</th><th>Software</th></tr></thead><tbody>";

    let results = whatRes.results;

    for (var i = 0; i < results.length; i++) {
        table += createResultRow(results[i].name, results[i].categories)
    }

    //close table
    table += "</tbody></table>"

    return table;

}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
/*const restoreOptions = () => {
    chrome.storage.local.get({
        whatCmsApiKey
    }, main)
};*/

function main() {

    //get url of current active tab
    chrome.tabs.query({ active: true, lastFocusedWindow: true }).then(res => {
        if (res != "undefined") {
            let currentTabUrl = res[0].url

            //build query string
            let REQUEST_STRING = `${WHAT_CMS_URL}?key=${WHAT_CMS_KEY}&url=${currentTabUrl}`;

            fetch(REQUEST_STRING, {
                method: "GET"
            }).then(res => res.json()).then(res => {
                if (res.result.code == "200") {
                    console.log(res);
                    document.getElementById("results").innerHTML = `${new Date(res.last_checked).toString()}`
                    document.getElementById("results").innerHTML = tabulateResults(res);
                } else {
                    document.getElementById("results").innerHTML = `Error ${res.result.code} - ${res.result.msg}`
                }

            }).catch(err => console.log(err));
        }
    })

}

chrome.storage.local.get(["whatApiKey"]).then((result) => {
    if (regex.exec(result.whatApiKey)) {
        console.log(result.whatApiKey)
        WHAT_CMS_KEY = result.whatApiKey;
        main();
    } else {
        let status = document.getElementById('status');
        status.innerHTML = "No Api Key found. Add key in extension options <a href='/options/options.html' target='_blank'>here</a>"
        status.style.display = "block";
    }
})


//TODO - add error handling for when no API key present
//TODO - add ability to get and store api key in options page
//TODO - design options page
//TODO - add links to whatcms.org