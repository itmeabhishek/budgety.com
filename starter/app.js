//budget controller
var BudgetController=( function(){
    var Expense=function(id,description,value)
{
    this.id=id;
    this.description=description;
    this.value=value;
    this.percentage=-1;
};
Expense.prototype.calcPercentage=function(totalIncome){
    if(totalIncome>0){
        this.percentage=Math.round((this.value/totalIncome)*100);
    }else{
        this.percentage=-1;
    }
};
Expense.prototype.getPercentage=function(){
    return this.percentage;
};
   var Income=function(id,description,value)
   {
       this.id=id;
       this.description=description;
       this.value=value;
   };
   var calculateTotal=function(type){
       var sum=0;
       Data.allItems[type].forEach(function(cur){
           sum+=cur.value
       });
       Data.totals[type]=sum;
   };
   var Data={
       allItems:{
           inc:[],
           exp:[]
       },
       totals:{
           inc:0,
           exp:0
       },
       budget:0,
       percentage:-1
   };
   return{
       addItems:function(type,des,val){
        var newItem,ID;
        if(Data.allItems[type].length>0){
       
        //create new ID
        ID=Data.allItems[type][Data.allItems[type].length-1].id+1;
        }
           else{
               ID=0;
           }
            //create nw item based on 'inc' or 'exp' type
        if(type==='exp')
        {
            newItem= new Expense(ID,des,val);
        } else if(type==='inc'){
            newItem=new Income(ID,des,val);
        }
        //push it to the data structure
        Data.allItems[type].push(newItem);
        //return the new element
       return newItem;
    },  
    deleteItem: function(type,id){
    //Data.allItems[type][id];
    //id=6
    //[12468]
    //index=3
    let a;
    if(type==='income'){
        a='inc';
    }else if(type==='expense'){
        a='exp';
    }
    var ids=Data.allItems[a].map(function(current){
     return current.id;
    });
     var index = ids.indexOf(id);
     if(index !== -1){
      Data.allItems[a].splice(index,1);
     }
    },
    calculateBudget:function(){
        //1.calculate total income and expenses
        calculateTotal('exp');
        calculateTotal('inc');

        //2.calculate the budget income-expenses
       Data.budget=Data.totals.inc-Data.totals.exp;

        //3.calculate the percentage of income that we spent
        if(Data.totals.inc>0){
        Data.percentage=Math.round((Data.totals.exp/Data.totals.inc)*100);}
        else{
            Data.percentage=-1;
        }

    },
    calculatePercentages:function(){
    Data.allItems.exp.forEach(function(current){
        current.calcPercentage(Data.totals.inc);
    });
    },
    getPercentages:function(){
        var allPerc=Data.allItems.exp.map(function(cur){
            return cur.getPercentage();
        });return allPerc;
    },
    getBudget:function(){
    return{
        budget:Data.budget,
        totalInc:Data.totals.inc,
        totalExp:Data.totals.exp,
        percentage:Data.percentage

    }
    },
    
    testing:function(){
        console.log(Data);
    }
   }

})();
//UIController
var UIController=(function(){
    var DOMstrings={
        inputType:'.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputBtn:'.add__btn',
        incomeContainer:'.income__list',
        expensesContainer:'.expenses__list',
        budgetLabel:'.budget__value',
        incomeLabel:'.budget__income--value',
        expenseLabel:'.budget__expenses--value',
        percentageLabel:'.budget__expenses--percentage',
        container:'.container',
        expensesPercLabel:'.item__percentage',
        dateLabel:'.budget__title--month'
        };
       var formatNumber=function(num,type){
            var numSplit;
            num=Math.abs(num);
            num=num.toFixed(2);
            numSplit=num.split('.');
            int=numSplit[0];
            if(int.length>3 && int.length<7){

                int=int.substr(0,int.length-3)+','+int.substr(int.length-3,int.length);
                dec=numSplit[1];
                return(type==='exp'?'-':'+')+' '+int+'.'+dec;
                
            }/*else if(int.length>6 && int.length<10){
                int=int.substr(0,int.length-6)+','+int.substr(int.length-5,int.length-4)+','+int.substr(int.length-3,int.length);
                dec=numSplit[1];
                return(type==='exp'?'-':'+')+' '+int+'.'+dec;
            }
*/
            
            else{
                dec=numSplit[1];
             return(type==='exp'?'-':'+')+' '+int+'.'+dec;
             }
        
    };
    var nodeListforEach=function(list,callback){
        for(var i=0;i<list.length;i++){
            callback(list[i],i);
        }
    };

    return{
        getinput:function(){
            return{
                type:document.querySelector(DOMstrings.inputType).value,
                description:document.querySelector(DOMstrings.inputDescription).value,
                value:parseFloat(document.querySelector(DOMstrings.inputValue).value)

            };
        },     
        addListItem:function(obj,type){
            var html,element,newHTML;
            //create HTML string wit placeholder text
            if(type==='inc'){
                element=DOMstrings.incomeContainer;
                html= '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else if(type==='exp'){
                element=DOMstrings.expensesContainer;
                html= '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }


            //Replace the placeholder text with some actual data
            newHTML=html.replace('%id%',obj.id);
            newHTML=newHTML.replace('%description%',obj.description);
            newHTML=newHTML.replace('%value%',formatNumber(obj.value,type));


            //Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHTML);
        },
        deleteListItem:function(selectorID){
        var el=document.getElementById(selectorID);
        el.parentNode.removeChild(el);
        },
        displayBudget:function(obj){
            obj.budget>0? type='inc':type='exp';
            document.querySelector(DOMstrings.budgetLabel).textContent=formatNumber(obj.budget,type);
            document.querySelector(DOMstrings.incomeLabel).textContent=formatNumber(obj.totalInc,'inc');
            document.querySelector(DOMstrings.expenseLabel).textContent=formatNumber(obj.totalExp,'exp');
            if(obj.percentage>0){
            document.querySelector(DOMstrings.percentageLabel).textContent=obj.percentage;
            }else{
            document.querySelector(DOMstrings.percentageLabel).textContent='---';
            }
        },
          displayPercentages:function(percentages){
              var fields=document.querySelectorAll(DOMstrings.expensesPercLabel);
              
              nodeListforEach(fields,function(current,index){
                  if(percentages[index]>0){
                      current.textContent=percentages[index]+'%';
                  }else{
                      current.textContent='---';
                  }
              });
          },
          displayMonth:function(){
              var now=new Date();
              var months=['January','February','March','April','May','June','July','August',
                        'September','October','November','December'];
              var month=now.getMonth();
              var year=now.getFullYear();
              document.querySelector(DOMstrings.dateLabel).textContent=year+' '+months[month];
          },
         getDOMstrings:function(){
            return DOMstrings;
        },
        clearFields:function(){
            var fields=document.querySelectorAll(DOMstrings.inputDescription+','+DOMstrings.inputValue);
            var fieldsArr=Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current,index,array){
                current.value="";
            });
            fieldsArr[0].focus();
        },
        changedType:function(){
            var fields=document.querySelectorAll(
                DOMstrings.inputType+','+
                DOMstrings.inputDescription+','+
                DOMstrings.inputValue);
                nodeListforEach(fields,function(cur){
                    cur.classList.add('red.focus');
                });
                document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
              },
       
    };
    })();
//Global App Controller
var Controller=(function(budgetctrl,UIctrl)
{ 
    var setupEventListeners = function(){
        var DOM=UIctrl.getDOMstrings();
       document.querySelector(DOM.inputType).addEventListener('change',UIctrl.changedType);
        document.querySelector(DOM.inputBtn).addEventListener('click',ctrladditem);
        document.addEventListener('keypress',function(event)
{
    if(event.keyCode===13||event.which===13){
        ctrladditem();
    }
        
    });
    document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
};
   var updateBudget=function(){

     //1. calculate the budget
     budgetctrl.calculateBudget();
     //2.Return the budget
     var budgetret=budgetctrl.getBudget();

     //3.display the budget on the UI
     UIctrl.displayBudget(budgetret);
    };
    var updatePercentages= function(){
        //1.calculate the percentages
budgetctrl.calculatePercentages();
        //2.read percentages from the budget controller
var percentages = budgetctrl.getPercentages();
        //3.update the UI with the new percentages
UIctrl.displayPercentages(percentages);

    };
    var ctrladditem=function(){
    //1. get the field input data
    var input = UIctrl.getinput();
    if(input.description!=="" && !isNaN(input.value)&&input.value>0){
//2. add the item to budget ctroller
var newItem= budgetctrl.addItems(input.type,input.description,input.value);

//3. add the item to the UI
UIctrl.addListItem(newItem,input.type);
//4. clear the field in ctrladditem
UIctrl.clearFields();
//5. calculate and update budget
updateBudget();
//6. calculate and update percentages
updatePercentages();
    }        
};
var ctrlDeleteItem=function(event){
    var itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;
if(itemID){
   var splitID=itemID.split('-');
    var type=splitID[0];
    var ID=parseInt(splitID[1]);
    //1.delete the item from the data structure
    budgetctrl.deleteItem(type,ID);
    //2.delete the item from the UI
    UIctrl.deleteListItem(itemID);
    //3.update and show the budget
    updateBudget();
    //4.calculate and update percentages
    updatePercentages();
}
};
    return {
        init:function(){
            console.log('application has started');
            UIctrl.displayMonth();
            UIctrl.displayBudget({ budget:0,
                totalInc:0,
                totalExp:0,
                percentage:-1});
            setupEventListeners();
        }
   
   
};
})(BudgetController,UIController);
Controller.init();