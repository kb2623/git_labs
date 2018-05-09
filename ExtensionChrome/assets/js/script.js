document.addEventListener("DOMContentLoaded", function(){
    
    osvezi();

    document.getElementById("btnStart").addEventListener("click", function(){
        //nastavi status v storage-u na "ON"
        chrome.storage.local.set({status:"ON"}, function(){
            alert("Storage je nastavljen na ON");
        });  
        chrome.runtime.sendMessage("RUN"); //pošlje sporočilo na background skripto da se zažene timer
        osvezi();
    })

    document.getElementById("btnStop").addEventListener("click", function(){
        chrome.storage.local.set({status:"OFF"}, function(){
            alert("Storage je nastavljen na OFF");
        });   
        chrome.runtime.sendMessage("STOP"); //pošlje sporočilo na background skripto da se prekine timer
        osvezi();
    });
})

//iz storage.local prebere vrednost "status" in to vpiše v div #res, če je undefined jo setta na OFF.
function osvezi()
{
    chrome.storage.local.get(['status'], function(result) {        
        if(result.status == undefined)
        {
            chrome.storage.local.set({status:"OFF"}, function(){
                document.getElementById("res").innerHTML = "OFF";
            });  
        }
        else
            document.getElementById("res").innerHTML = result.status;        
    });
}