
var ques=$('.ques h1'),qBox=$('.qBox');
var rA=0,wA=0;	
var resR=$('#resA'),resW=$('#resW');	
var firebaseRef=firebase.database().ref(); 	

$(function(){
	const uId=[];
	
			firebaseRef.once("value", function(data) {
				var obj=data.val().players;
				var ss=Object.keys(obj);
				ss.forEach(function(data){
				  uId.push(obj[data].USN);
				});
			});	

	

	$.ajax( {
    
     url:"https://opentdb.com/api.php?amount=50&difficulty=easy&type=multiple",
      dataType: "json",
      success: function(data){

    const questions=[];
      	for(let i=0;i<data.results.length;i++){
      	if(data.results[i].category=="Vehicles" || data.results[i].category=="Geography" ||data.results[i].category=="General Knowledge" || data.results[i].category=="Entertainment: Books"  || data.results[i].category=="Sports"  || data.results[i].category=="Science & Nature" || data.results[i].category=="Entertainment: Film" || data.results[i].category=="Science: Computers" || data.results[i].category=="History" || data.results[i].category=="Science: Gadgets" || data.results[i].category=="Animals")
      	if(data.results[i].correct_answer.length<=20 && data.results[i].incorrect_answers[0].length<=20 && data.results[i].incorrect_answers[1].length<=20 && data.	results[i].incorrect_answers[2].length<=20)
		 	{
      	questions.push(data.results[i]);
      }
      }

      
      	$('.sId').click(function(e){
			e.preventDefault();
			const usn=$('.id').val();
			
			if(uId.indexOf(usn)==-1){
				$('.uId').hide();
				$('.qBox').show();
				firebaseRef.child("players").push().set(
  						{
			     "USN":usn
   			 }
  					);
				startQuiz(questions,usn);
			}
			else{
				alert('You have already attempted!!');
				$('.id').val('');
			}
		});
      },
    cache:false
  });
		
	
});

function startQuiz(res,usn){
	var i=1,h;
	var arr=getRandom();
	var	op1=$('.op'+arr[0]),
		op2=$('.op'+arr[1]),
		op3=$('.op'+arr[2]),
		op4=$('.op'+arr[3]);
		nextQues(res);

		var tI=setInterval(nextQues,11000);
		
		
	
		function nextQues(){
			h=0;
			var pB=setInterval(pBar,1000);



			if(i>1){
				const id=$('.radio-btn:checked').attr('id');
				const ans=$("label[for='"+id+"']").text()
				
				if(ans!=res[i-1].correct_answer)
					{
						qBox.addClass('wrong');
						wA++;
						
					}
					else{qBox.addClass('right');
					rA++;
				}
			$('#'+id).prop('checked',false);

			}

			
			if(i==11)
			{
				resR.html(rA);
				resW.html(wA);
				$('.qBox').hide();
				$('.win').css({
							opacity: 1
						});

				clearInterval(tI);
				clearInterval(pB);
				firebaseRef.child("players").push().set(
  						{
  				"USN" : usn,
			    "rAns" : rA,
			    "wAns" : wA
   			 }
  					);
			}



			
			
		 
			 	ques.html(res[i].question);
				op1.html(res[i].correct_answer);
				op2.html(res[i].incorrect_answers[0]);
				op3.html(res[i].incorrect_answers[1]);
				op4.html(res[i].incorrect_answers[2]);
				
				i++;  
				
				
		setTimeout(function(){
			qBox.removeClass('right');
			qBox.removeClass('wrong');
		},1000);
				

		function pBar(){
			h+=10;
			$('.pBar').css('height',h+'%');
			
			if(h==100 )
				clearInterval(pB);

		}


			
			
		}

		
}

function getRandom(){
 var a=[1,2,3,4];
function shuffle(array) {
  var tmp, current, top = array.length;
  if(top) while(--top) {
    current = Math.floor(Math.random() * (top + 1));
    tmp = array[current];
    array[current] = array[top];
    array[top] = tmp;
  }
  return array;
}
return shuffle(a);
}
