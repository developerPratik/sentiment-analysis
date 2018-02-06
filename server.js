let express = require('express');
let app = express();
let mood = require('./mood');

let bodyParser = require('body-parser');

app.use(function (req, res, next) {

  res.setHeader('Access-Control-Allow-Origin', '*');

  res.setHeader('Access-Control-Allow-methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
});

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({
  limit: '5mb',
  extended: true
}));


function  negativity(phrase){

    let addPush, hits, i, item, j, len, noPunctuation, tokens, words;
    addPush = function(t, score) {
      hits -= score;
      return words.push(t);
    };
    noPunctuation = phrase.replace(/[^a-zA-Z ]+/g, ' ').replace('/ {2,}/', ' ');
    tokens = noPunctuation.toLowerCase().split(" ");
    hits = 0;
    words = [];
    for (i = j = 0, len = tokens.length; j < len; i = ++j) {
      item = tokens[i];
      if (mood.hasOwnProperty(item)) {
        if (mood[item] < 0) {
          addPush(item, mood[item]);
        }
      }
    }
    return {
      score: hits,
      comparative: hits / words.length,
      words: words
    };
}

function positivity(phrase) {
    let addPush, hits, i, item, j, len, noPunctuation, tokens, words;
    addPush = function(t, score) {
      hits += score;
      return words.push(t);
    };
    noPunctuation = phrase.replace(/[^a-zA-Z ]+/g, ' ').replace('/ {2,}/', ' ');
    tokens = noPunctuation.toLowerCase().split(" ");
    hits = 0;
    words = [];
    for (i = j = 0, len = tokens.length; j < len; i = ++j) {
      item = tokens[i];
      if (mood.hasOwnProperty(item)) {
        if (mood[item] > 0) {
          addPush(item, mood[item]);
         }
      }
    }
    return {
      score: hits,
      comparative: hits / words.length,
      words: words
    };
  }


app.get('/', function(request, response){

    response.send('hello world');
})
app.post('/analyze', function(request, response){
    
    let phrase = request.body.phrase;

    let positiveVal = positivity(phrase);

    let negativeVal = negativity(phrase);

    let difference = positiveVal.score - negativeVal .score;

    let result =  {
        result:  difference === 0 ? 'Neutral' : difference > 0 ? 'Positve Feedback' : 'Negative Feedback',
        score: positiveVal.score - negativeVal.score,
        comparative: negativeVal.comparative - negativeVal.comparative,
        positive: positiveVal,
        negative: negativeVal
      };
  
      console.log(result);

      response.send('OK');
});


app.listen(8000, function(){
    console.log('server is running');
})