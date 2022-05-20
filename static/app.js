window.onload = function () {
  if (window.jQuery) {
    // jQuery is loaded
    console.log("jQuery has loaded!");
  } else {
    // jQuery is not loaded
    console.log("jQuery has not loaded!");
  }
  if (window.location.href.match("http://127.0.0.1:5000/boggle") != null) {
    timer();
  }
  //const $form = $("#boggle-form")
  let keepScore = 0;
  checkDuplicates = new Set();

  $("#boggle-form").on("submit", async function sendWord(evt) {
    evt.preventDefault();
    $("#response-div").remove();
    let query = $("#guess").val();
    if (!query) return
    if(checkDuplicates.has(query)) 
    {alert('Already entered this word')
     return}
    if (!query) return;
    console.log(query);
    //$("#res-display").hide()
    await checkWord(query);
  });

  async function checkWord(query) {
    let res = await axios.get(`http://127.0.0.1:5000/guess?guess=${query}`);
    console.log(res.data);
    displayRespone(res.data);
  }

  function displayRespone(res) {
    $("#guess").val("");

    let { result } = res;
    let { score } = res;
    let { word } = res;
    checkDuplicates.add(word)
    
    keepScore += score;
    let $responseContainer = $(`<div id="response-div"></div>`);
    let $score = $(`<p>${keepScore}</p>`);
    let $displayWords = $(`<li>${word}</li> `)

    let $display = $(`<h2>${result}</h2>`);
    $("#res-display").append($responseContainer);
    $("#response-div").append($display).append($score);
    $("#used-words").append($displayWords)
  }

  async function timer() {
    let $timerElement = $("#timer-display");
    let sec = 60;
    let timer = setInterval(function () {
      $timerElement.text(`00:${sec}`);
      sec--;

      if (sec < 0) {
        $("#btn").attr("disabled", true);
        clearInterval(timer);
        gameStats(keepScore);
      }
    }, 1000);
  }

  async function gameStats(score) {
    score = keepScore;
    console.log(score);
    let res = await axios({
      url: "http://127.0.0.1:5000/game_stats",
      method: "POST",
      data: { userscore: score },
    });

    if (res.data.brokeRecord) {
      alert(`New record: ${score}`, "ok");
    } else {
      alert(`Final score: ${score}`, "ok");
    }
  }
};

//contentType: "application/json"
