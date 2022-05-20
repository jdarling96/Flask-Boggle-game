let keepScore = 0
window.onload = function() {
    if (window.jQuery) {  
        // jQuery is loaded  
        console.log("jQuery has loaded!");
    } else {
        // jQuery is not loaded
        console.log("jQuery has not loaded!");
    }

    timer()

//const $form = $("#boggle-form")


$("#boggle-form").on("submit", async function sendWord(evt){
evt.preventDefault();
$('#response-div').remove()
let query = $("#guess").val()
if (!query) return;
console.log(query)
//$("#res-display").hide()
await checkWord(query)
    

});


async function checkWord(query) { 
    let res = await axios.get(`http://127.0.0.1:5000/guess?guess=${query}`)
    console.log(res.data)
    displayRespone(res.data)
    

    }

 
function displayRespone(res) {
    $("#guess").val('')

     let { result } = res
     let { score } = res
     
     keepScore += score
     let $responseContainer = $(`<div id="response-div"></div>`)
     let $score = $(`<p>${keepScore}</p>`)
     
     let $display = $(`<h2>${result}</h2>`)
     $("#res-display").append($responseContainer)
     $("#response-div").append($display).append($score)
     

     }

function timer(){
        let $timerElement = $("#timer-display")
        let sec = 10;
        let timer = setInterval(function(){
            $timerElement.text(`00:${sec}`);
            sec--;
            if (sec < 0) {
                clearInterval(timer);
                $('#btn').attr("disabled", true)
                send()
                alert('Game Over!')
            }
            
        }, 1000);

        
    }

    async function send(){
    await gameStats(keepScore)


    }
    
    async function gameStats(score) {
        score = keepScore
        let res = await axios.post('http://127.0.0.1:5000/game_stats', {userscore:score})
           
            
            //contentType: "application/json"
            console.log(res.data)

    }



}