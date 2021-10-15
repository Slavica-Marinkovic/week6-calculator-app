document.addEventListener("DOMContentLoaded", () => {
    const body = document.querySelector('body');
    const themes = document.querySelectorAll('.btn-theme');
    const numbers = document.querySelectorAll('.num');
    const operators = document.querySelectorAll('.btn-operator');
    const input = document.querySelector('#input-text');
    const equal = document.querySelector('.btn-calculate');
    const reset = document.querySelector('.btn-reset');
    const del = document.querySelector('.btn-del');
    var previous = null;
    var currentOpr = null;
    var currentInput = "";
    var endOfOpr = false;
 

    function showElem(elem){
        document.querySelector(elem).style.background = "";
    }
    function hideElem(elem){
        let elems = document.querySelectorAll(elem);
        elems.forEach(function(item){
            item.style.background = "none";
        });
    }

    function getLocalVal(local){
        body.classList.add(local);
        var theme;
        switch(local) {
            case 'theme1' : theme='.first-theme';
            break;
            case 'theme2' : theme='.second-theme';
            break;
            case 'theme3' : theme='.third-theme';
            break;
        }
        showElem(theme);
        hideElem('.btn-theme:not('+theme+')');
    }

    function beginLoad(){
        var local = localStorage.getItem('currentTheme');
        if(local != null){
            getLocalVal(local);
            return;
        }
        const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const userPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
        if(userPrefersDark){
            body.classList.add('theme1');
            showElem('.first-theme');
            hideElem('.btn-theme:not(.first-theme)');
        }else if(userPrefersLight){
            body.classList.add("theme2");
            showElem('.second-theme');
            hideElem('.btn-theme:not(.second-theme)');
        }
    }

    themes.forEach( item => {
        item.addEventListener('click', () => {
            if(item.classList.contains('first-theme')) {
                body.className = '';
                body.classList.add("theme1");
                showElem('.first-theme');
                hideElem('.btn-theme:not(.first-theme)');
                window.localStorage.setItem("currentTheme", "theme1");
            }
            else if (item.classList.contains('second-theme')) {
                body.className = '';
                body.classList.add("theme2");
                showElem('.second-theme');
                hideElem('.btn-theme:not(.second-theme)');
                window.localStorage.setItem("currentTheme", "theme2");
            }
            else {
                body.className = '';
                body.classList.add("theme3");
                showElem('.third-theme');
                hideElem('.btn-theme:not(.third-theme)');
                window.localStorage.setItem("currentTheme", "theme3");
            }
        });
    });
    beginLoad();

	numbers.forEach(item => {
		item.addEventListener('click', () => {
			if(currentInput.indexOf(".") > -1 && item.innerText == "."){
				return;
			}
			if(currentInput == "" && item.innerText == "."){
				currentInput = "0.";
				input.value = currentInput;
				return;
			}
			currentInput += item.innerText;
			currentInput = removeZero(currentInput);
			input.value = currentInput;
		});
	});

	operators.forEach(item => {
		item.addEventListener('click', () => {
			
			if(previous == null && currentInput != ""){
				previous = parseFloat(currentInput);
				currentInput = "";
			}
			if(previous == null && endOfOpr == true){
				previous = parseFloat(input.value);
			}
			switch(item.innerText) {
				case "+":	
				calculate();
				currentOpr = "+";
				break;
				
				case "-":	
				calculate();
				currentOpr = "-";
				break;

				case "x":
				calculate();
				currentOpr = "*";
				break;

				case "/":
				calculate();
				currentOpr = "/";
				break;
			}
			
		});
	});

	equal.addEventListener('click', () => {
		if(currentInput != ""){
			previous = operation(currentOpr,previous,parseFloat(currentInput));
			input.value = previous;
			previous = null;
			currentInput = "";
			currentOpr = null;
			endOfOpr = true;
		}		
		
	});
	reset.addEventListener('click', () => {
		previous = null;
		currentOpr = null;
		currentInput = "";		
		input.value = previous;
	});
	del.addEventListener('click', () => {
		if(currentInput != ""){
			currentInput = currentInput.substring(0,currentInput.length -1);
			input.value = currentInput;
		}
		else {
			currentInput = "0";
		}
	});

	window.addEventListener('keydown', (event) =>{
        event.preventDefault();
		var keys = ["0","1","2","3","4","5","6","7","8","9","+","-","*","/",".","Enter","Escape","Delete","Backspace"];
		if(keys.indexOf(event.key) > -1){
			if(event.key != "+" && event.key != "-" && event.key != "*" && event.key != "/" && event.key != "Enter" &&
			 event.key !="Escape" && event.key != "Delete" && event.key != "Backspace"){
				 if(currentInput.indexOf(".") > -1 && event.key == "."){
				return;
			}
			if(currentInput == "" && event.key == "."){
				currentInput = "0.";
				input.value = currentInput;
				return;
			}
			currentInput += event.key;
			currentInput = removeZero(currentInput);
			input.value = currentInput;
			}

			if(event.key == "+" || event.key == "-" || event.key == "*" || event.key == "/"){
				if(previous == null && currentInput != ""){
					previous = parseFloat(currentInput);
					currentInput = "";
				}
				if(previous == null && endOfOpr == true){
					previous = parseFloat(input.value);
				}
				switch(event.key) {
					case "+":	
					calculate();
					currentOpr = "+";
					break;
					
					case "-":	
					calculate();
					currentOpr = "-";
					break;
	
					case "*":
					calculate();
					currentOpr = "*";
					break;
	
					case "/":
					calculate();
					currentOpr = "/";
					break;
				}
			}

			if(event.key == "Enter"){
                if(input.value == ""){
                    return;
                }

				if(currentInput != ""){
					previous = operation(currentOpr,previous,parseFloat(currentInput));
					input.value = previous;
					previous = null;
					currentInput = "";
					currentOpr = null;
					endOfOpr = true;
				}
				return;
			}
			if(event.key == "Escape" || event.key == "Delete"){
				previous = null;
				currentOpr = null;
				currentInput = "";		
				input.value = previous;
				return;
			}
			if(event.key == "Backspace"){
				if(currentInput != ""){
					currentInput = currentInput.substring(0,currentInput.length -1);
					input.value = currentInput;
				}
				else {
					currentInput = "0";
				}
				return;
			}
		}
	});

	function operation(sign, num1, num2){
		switch(sign){
			case "+":
			num1 = num1 + num2;
			break;
			case "-":
			num1 = num1 - num2;
			break;
			case "*":
			num1 = num1 * num2;
			break;
			case "/":
			num1 = num1 / num2;
			break;
		}
	return num1;
	}

	function calculate(){
		if(previous != null && currentInput != "" && currentOpr != null){
			previous = operation(currentOpr,previous,parseFloat(currentInput));
			input.value = previous;
			currentInput = "";
		}
	}

	function removeZero(str){
        function rem(sign){
            while(str.charAt(str.indexOf(sign) + 1) == "0" && str.charAt(str.indexOf(sign) + 2) != "." && str.charAt(str.indexOf(sign) + 2) != ""){
                str = str.substring(0,(str.indexOf(sign) + 1)) + str.substring(str.indexOf(sign) + 2);
            }
        }    
        while(str.charAt(0) == "0" && str.charAt(1) != "." && str.length > 1){
            str = str.substring(1);
        }
        if(str.indexOf("+") > -1){
            rem("+");
        }
        if(str.indexOf("-") > -1){
            rem("-");
        }
        if(str.indexOf("*") > -1){
            rem("*");
        }
        if(str.indexOf("/") > -1){
            rem("/");
        }
        return str;
    }         
});
    
