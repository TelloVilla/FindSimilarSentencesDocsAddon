/**
 * @OnlyCurrentDoc
 */

 function onOpen(e) {
    DocumentApp.getUi().createAddonMenu()
      .addItem("Start", "showSidebar")
      .addToUi();
  }
  
  function onInstall(e){
    onOpen(e);
  }
  
  function showSidebar(){
    const ui = HtmlService.createHtmlOutputFromFile("sidebar")
      .setTitle("Dupesent")
      DocumentApp.getUi().showSidebar(ui);
  }
  
  function genRandomColor(min = 5, max = 16){
    hexChar = [0,1,2,3,4,5,6,7,8,9,"A","B","C","D","E","F"]
    min = parseInt(min);
    max = parseInt(max);
    var hexColor = "#";
    for(var index = 0; index < 6; index++){
      const randPos = Math.floor(Math.random() * (max - min) + min)
      hexColor += hexChar[randPos];
    }
    return hexColor;
  }
  
  
  
  //Calculate similarity between Strings using Levenshtein Distance
  function levenshteinDist(a, b){
    if(a.length == 0) return b.length;
    if(b.length == 0) return a.length;
  
    var matrix = [];
  
    var i;
    for(i = 0; i <= b.length; i++){
      matrix[i] = [i];
    }
  
    var j;
    for(j = 0; j <= a.length; j++){
      matrix[0][j] = j;
    }
  
    for(i = 1; i <= b.length; i++){
      for(j = 1; j <= a.length; j++){
        if(b.charAt(i-1) == a.charAt(j-1)){
          matrix[i][j] = matrix[i-1][j-1];
  
        }else{
          matrix[i][j] = Math.min(matrix[i-1][j-1]+1,
                                  Math.min(matrix[i][j-1] + 1,
                                  matrix[i-1][j] + 1));
        }
      }
    }
    return matrix[b.length][a.length];
  }
  
  function findDupe(thresh = 20, min = 0, max = 16){
    const re = /([\w\s-,]{10,}\.)/g;
    var body = DocumentApp.getActiveDocument().getBody();
    var text = body.getText();
    var editText = body.editAsText();
    var sentences = text.match(re);
  
    while( typeof(i = sentences.shift()) !== "undefined"){
  
      sentences.forEach(function(x){
        if(levenshteinDist(i, x) < Number(thresh)){
          var sent1 = editText.findText(i);
          var sent2 = editText.findText(x, sent1);
          var colorPair = genRandomColor(min, max);
  
          sent1.getElement().asText().setBackgroundColor(sent1.getStartOffset(), sent1.getEndOffsetInclusive(), colorPair);
          sent2.getElement().asText().setBackgroundColor(sent2.getStartOffset(), sent2.getEndOffsetInclusive(), colorPair);
        }
      })
  
    }
    
  
    
    
  }