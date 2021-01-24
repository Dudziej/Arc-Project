// zamkniecie tab
function close_window() {
  if (confirm("Close Window?")) {
    close();
  }
}
// zamkniecie tab

// chowanie/pokazanie div
function show_hide() {
  var x = document.getElementById("myDIV");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
} 
// chowanie/pokazanie div

// funkcja na zaminae pelnej daty na forme yyyy-mm-dd
    function tommddyyyy(date) {
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }
    // funkcja na zaminae pelnej daty na forme yyyy-mm-dd

    //funkcja obliczajaca roznice pomiedzy datami w miesiacach
    function monthDiff(d1, d2) {
        var months;
        months = (d2.getFullYear() - d1.getFullYear()) * 12;
        months -= d1.getMonth();
        months += d2.getMonth();
        return months <= 0 ? 0 : months;
    }
    //funkcja obliczajaca roznice pomiedzy datami w miesiacach

        // funkcje potrzebne do poprawnego dodawania miesiecy do daty
        Date.isLeapYear = function (year) { 
            return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)); 
        };

        Date.getDaysInMonth = function (year, month) {
            return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
        };

        Date.prototype.isLeapYear = function () { 
            return Date.isLeapYear(this.getFullYear()); 
        };

        Date.prototype.getDaysInMonth = function () { 
            return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
        };

        Date.prototype.addMonths = function (value) {
            var n = this.getDate();
            this.setDate(1);
            this.setMonth(this.getMonth() + value);
            this.setDate(Math.min(n, this.getDaysInMonth()));
            return this;
        };
        // funkcje potrzebne do poprawnego dodawania miesiecy do daty


function template(procent_roczny, cykl_miesiace, all_miesiace, kwota_przedwczesna_per_obligacja , ponowny_wykup_tanszy, kapitalizacja, staly_proc, rozny_proc_po_pierwszym_mies, proc_po_pierwszym_mies){
  console.log(procent_roczny);
        
    // podbranie danych ze html
    var results = document.getElementById("results");
    var finanse = document.getElementById("finanse").value;
    finanse = Math.floor(finanse/100)*100;
    var data1 = document.getElementById("data1").value;
    var data2 = document.getElementById("data2").value;
    // podbranie danych ze html
    
    // sprawdzenie danych
    if(parseFloat(finanse)>0 && Number.isFinite(parseFloat(finanse)) && Number.isFinite(parseFloat(data1)) && Number.isFinite(parseFloat(data2))){
    // sprawdzenie danych
    
    // wyczyszcznie div results
    results.innerHTML = ""; 
    // wyczyszcznie div results
    
    // ustawienie daty rozpoczecia na pierszy dzien kolejnego miesiaca
    var data11 = new Date(data1);
    data11.setMonth(data11.getMonth()+1, 1);
    // ustawienie daty rozpoczecia na pierszy dzien kolejnego miesiaca
    
    // % / fianse / daty od ktorej sa naliczane % i daty sprzedania
    var h2 = document.createElement("P");
    h2.innerHTML = "Oprocentowanie : " + Math.round((procent_roczny*100) * 10) / 10 + "%";
    var pf = document.createElement("P");
    pf.innerHTML = "Finanse : " + finanse.toString() + "<br>";
    var pd = document.createElement("P");
    pd.innerHTML = "Data od ktorej naliczane beda odsetki : " + tommddyyyy(data11).toString() + "<br>";
    var pc = document.createElement("P");
    pc.innerHTML = "Data sprzedarzy : " + data2.toString() + "<br>";
    // % / fianse / daty od ktorej sa naliczane % i daty sprzedania
    
    // obliczenie i wypisanie ilosci pelnych miesiecy pomiedzy datami
    var czas = monthDiff(data11,new Date(data2));
    var pczas = document.createElement("P");
    pczas.innerHTML = "Czas posiadania [miesiace] : " + czas.toString() + "<br>";
    // obliczenie i wypisanie ilosci pelnych miesiecy pomiedzy datami
    
    // wypisanie na stronie % / kwoty / daty kupna i sprzedarzy i ilosci miesiecy
    results.append(h2);
    results.append(pf);
    results.append(pd);
    results.append(pc);
    results.append(pczas);
    // wypisanie na stronie % / kwoty / daty kupna i sprzedarzy i ilosci miesiecy
    
    // sprawdzenie czy daty sa poprawne
    var error_date = document.createElement("P");
    error_date.innerHTML = "Złe daty.";
    if(czas < 0){results.append(error_date)}
    
    var error_cycle = document.createElement("P");
    error_cycle.innerHTML = "Zbyt malo czasu na uzyskanie dochodu. [minimum " + cykl_miesiace + " miesiacy]";
    if(czas<cykl_miesiace && czas>=0){results.append(error_cycle)}
    // sprawdzenie czy daty sa poprawne
    
    // jezeli daty sa poprawne 
    if(czas>=cykl_miesiace){
    // jezeli daty sa poprawne
        
        // obliczenie oprocentowania w skali x mies / ilosci cykli 
        var oprocentowanie = procent_roczny/(12/cykl_miesiace);
        var cykle = Math.floor(czas/cykl_miesiace);
        // obliczenie oprocentowania w skali x mies / ilosci cykli
        
        // stworzenie i wypisanie ilosci cykli
        var pcykle = document.createElement("P");
        pcykle.innerHTML = "Ilosc cylki w podanym okresie czasu : " + cykle.toString() + "<br>";
        results.append(pcykle);
        // stworzenie i wypisanie ilosci cykli
        
        // zmienna odpowiadajaca za przyrost pieniedzy
        var kwota = 0;
        // zmienna odpowiadajaca za przyrost pieniedzy
        
        // petla obliczajca odstetki co 12 mies i wypisujaca je z datami od kiedy mozna je odebrac
        for(var i = 1 ; i < cykle + 1 ; i++){
            
            // jezeli nie bedzie wyplaty przed pelnym cyklem 
            if((cykl_miesiace*i)%all_miesiace==0){
            
                var kwota_konc = finanse;
            if(kapitalizacja){
                kwota_konc += kwota;
            }
                
            if(staly_proc){   
            kwota += parseFloat((kwota_konc) * oprocentowanie);
            }
                
            if(rozny_proc_po_pierwszym_mies){    
            if(i == 1){    
            kwota += parseFloat((kwota_konc) * oprocentowanie);
            } else {
            var PROCENT = proc_po_pierwszym_mies;
            kwota += parseFloat((kwota_konc) * PROCENT);
            }
            }
                
                var wyplaty = document.createElement("P");
                
            var text = "";
            if(i!=1){
                text = "(ponowny zakup)";
            }
                
            wyplaty.innerHTML = "Cykl [pelny " + text + "] : " + i + " | " + "Data : " + tommddyyyy(data11.addMonths(cykl_miesiace)).toString() + "<br>" + "Zysk : " + kwota.toFixed(2); + "<br>";
                wyplaty.setAttribute('class','border');
            results.append(wyplaty);
            kwota += (ponowny_wykup_tanszy*(finanse/100));
            }
            // jezeli nie bedzie wyplaty przed pelnym cyklem 
            
            // jezeli bedzie wyplata przed pelnym cyklem -x zl za kazda obligacje
            if((cykl_miesiace*i)%all_miesiace!=0){
                
                var kwota_konc = finanse;
            if(kapitalizacja){
                kwota_konc += kwota;
            }
                
            if(staly_proc){   
            kwota += parseFloat((kwota_konc) * oprocentowanie);
            }
                
            if(rozny_proc_po_pierwszym_mies){    
            if(i == 1){    
            kwota += parseFloat((kwota_konc) * oprocentowanie);
            } else {
            var PROCENT = proc_po_pierwszym_mies;
            kwota += parseFloat((kwota_konc) * PROCENT);
            }
            }
                
                // jezeli kwota - x za obligacje < 0 to wypisz zysk = 0
                if((kwota-(kwota_przedwczesna_per_obligacja*(finanse/100)))<0){
                    var wyplaty = document.createElement("P");
            
                    wyplaty.innerHTML = "Cykl [niepelny] : " + i + " | " + "Data : " + tommddyyyy(data11.addMonths(cykl_miesiace)).toString() + "<br>" + "Zysk : " + kwota.toFixed(2) + "<br>" + "Oplaty : " + (kwota_przedwczesna_per_obligacja*(finanse/100)).toFixed(2) + "<br>" + "Zysk prawdziwy : " + 0 + "<br>";
                    
                   
                    
                    wyplaty.setAttribute('class','border');
                    results.append(wyplaty);
                }
                // jezeli kwota - x za obligacje < 0 to wypisz zysk = 0
                
            // jezeli kwota - x za obligacje > 0 to wypisz zysk
                else {
            var wyplaty = document.createElement("P");
            
            wyplaty.innerHTML = "Cykl [niepelny] : " + i + " | " + "Data : " + tommddyyyy(data11.addMonths(cykl_miesiace)).toString() + "<br>" + "Zysk : " + kwota.toFixed(2) + "<br>" + "Oplaty : " + (kwota_przedwczesna_per_obligacja*(finanse/100)).toFixed(2) + "<br>" + "Zysk prawdziwy : " + (kwota-(kwota_przedwczesna_per_obligacja*(finanse/100))).toFixed(2); + "<br>";
                    wyplaty.setAttribute('class','border');
            results.append(wyplaty);
            }
            // jezeli kwota - x za obligacje > 0 to wypisz zysk
                
            }
            // jezeli bedzie wyplata przed pelnym cyklem -x zl za kazda obligacje
            
        }
        // petla obliczajca odstetki co x mies i wypisujaca je z dataki kiedy mozna je odebrac
        
    }
    } else {
    // wyczyszcznie div results
    results.innerHTML = ""; 
    // wyczyszcznie div results
        
        // error msg
        var error_input = document.createElement("P");
            
            error_input.innerHTML = "Błedne dane wejsciowe lub ich brak.";
            results.append(error_input);
        // error msg
    }
 
};

function obl050(){
 template(0.005, 3 , 3 , 0 , 0 , false, true, false , 0.005);
}

function obl100(){
 template(0.01, 12, 24 , 0.7 , 0.1, true, true, false, 0.01);
}

function obl110(){
  template(0.011, 6, 36, 0.7, 0.1, false, false, true, 0.011);
}

function obl130(){
  template(0.013, 12, 48, 0.7, 0.1, false, false, true, 0.013);
}

function obl170(){
  template(0.017, 12, 120, 2, 0.1, true, false, true, 0.017);
}

function obl150(){
  template(0.015, 12, 72, 0.7, 0, true, false, true, 0.015);
}

function obl200(){
  template(0.02, 12 ,148, 2, 0, true, false, true, 0.02);
}