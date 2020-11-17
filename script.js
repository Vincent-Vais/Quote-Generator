const quoteContainer = document.getElementById("quote-container");
const quoteText = document.getElementById("quote");
const authorText = document.getElementById("author");
const twitterBtn = document.getElementById("twitter");
const newQuoteBtn = document.getElementById("new-quote");
const loader = document.getElementById("loader");
const quoteAuthor = document.querySelector(".quote-author");

const likeIcn = document.getElementById("liked");
const closeIcn = document.getElementById("close");
const popper = document.getElementById("popper");
const popperContainer = document.querySelector(".container");
const likeQuote = document.getElementById("like");

let currentQuote = {};
let id = 0;

function tweetQuote() {
  const quote = quoteText.innerText;
  const author = authorText.innerText;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
  window.open(twitterUrl, "_blank");
}

function showLoadSpin() {
  loader.style.display = "block";
  quoteContainer.hidden = true;
}

function hideLoadSpin() {
  if (!loader.hidden) {
    loader.style.display = "none";
    quoteContainer.hidden = false;
  }
}

function showLiked(e) {
  toggleOutline(e);
}

function icnRemoveOutline(e) {
  toggleOutline(e);
  togglePopper();
  manipPopper("show");
}

function toggleOutline(e) {
  e.target.classList.toggle("far");
  e.target.classList.toggle("fas");
}

function closeLiked(e) {
  manipPopper("hide");
  window.setTimeout(() => {
    togglePopper();
  }, 3000);
}

function togglePopper() {
  popper.classList.toggle("hidden");
}

function handleOutline(e) {
  e.target.nextSibling.nextSibling.classList.toggle("far");
  e.target.nextSibling.nextSibling.classList.toggle("fas");
}

function addLikedQuote() {
  window.localStorage.setItem(`${id}`, JSON.stringify(currentQuote));
}

function populatePopper() {
  console.log(window.localStorage);
  for (const item in window.localStorage) {
    const data = window.localStorage.getItem(item);
    if (data) {
      addMarkup(JSON.parse(data));
    }
  }
}

function addMarkup(data) {
  const markup = `
  <div class="quote-text quote-popper">
      <div class="quote-text">
        ${data.quoteText}
      </div>
      <div class="quote-author">
      ${data.authorText}
      </div>
    </div>
  </div>
    `;
  popperContainer.insertAdjacentHTML("beforeend", markup);
}

function clearMarkup() {
  popperContainer.innerHTML = "";
}

function manipPopper(type) {
  if (type === "show") {
    popper.classList.remove("hide");
    popper.classList.add("show");
    populatePopper();
  } else {
    popper.classList.remove("show");
    popper.classList.add("hide");
    clearMarkup();
  }
}

let errCounter = 0;

// Get Quote From Api
async function getQuote() {
  showLoadSpin();
  const proxyUrl = "https://cors-anywhere.herokuapp.com/";
  // const proxyUrl = "https://murmuring-river-09921.herokuapp.com/";
  const apiUrl =
    "http://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en";
  try {
    const resp = await fetch(proxyUrl + apiUrl);
    const data = await resp.json();
    if (data) {
      currentQuote = {
        authorText: data.quoteAuthor,
        quoteText: data.quoteText,
      };
      authorText.innerText = data.quoteAuthor || "Unknown";
      if (data.quoteText.length > 120) {
        quoteText.classList.add("long-quote");
      } else if (quoteText.className.includes("long-quote")) {
        quoteText.classList.remove("long-quote");
      }
      quoteText.innerText = data.quoteText;
      hideLoadSpin();
      id++;
    }
  } catch (error) {
    console.log("Whoops, no Quote, ", error);
    if (errCounter++ < 10) {
      getQuote();
    } else {
      return;
    }
  }
}

// OnLoad
getQuote();

newQuoteBtn.addEventListener("click", getQuote);
twitterBtn.addEventListener("click", tweetQuote);
likeIcn.addEventListener("mousedown", showLiked);
likeIcn.addEventListener("mouseup", icnRemoveOutline);
closeIcn.addEventListener("click", closeLiked);
likeQuote.addEventListener("mouseenter", handleOutline);
likeQuote.addEventListener("mouseleave", handleOutline);
likeQuote.addEventListener("click", addLikedQuote);
