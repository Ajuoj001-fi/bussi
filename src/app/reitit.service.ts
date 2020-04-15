import { Injectable } from '@angular/core';
import { Reitti } from './Reitti';
import * as data from './reittiopas.json';

@Injectable({
  providedIn: 'root'
})

export class ReititService {

  lahto : string = null;
  maali : string = null;

  asemat : any = data.pysakit;
  tiet : any = data.tiet;
  linjastot : any = data.linjastot;

  lyhinReitti : Reitti[];

  reitit : Reitti[];

  varit : Object = {
    "keltainen" :"yellow",
    "vihreä" : "green",
    "sininen" : "blue",
    "punainen" : "red"
  };

  constructor() {}

  aloitaHaku = () : void => {
    let t0 = performance.now();

    this.lyhinReitti = [{
      kuljettuReitti : null,
      linjat : null,
      linjaparit : null,
      kuljettuMatka : null,
      valmis: false
    }];

    this.reitit = [];

     this.tiet.forEach((tie) => {
      if(tie.mista == this.lahto || tie.mihin == this.lahto){ //haetaan kaikki tiet mistä löytyy meidän lähtö
        let linjanNimi = this.tarkistaLinja(tie.mista,tie.mihin);  //tarkistetaan että kyseinen tieosuus löytyy mistään linjastosta, paluuna tulee linjan nimi
        if(linjanNimi != null){ //tie kuuluu johonkin linjaan
          let kohde = tie.mihin;
          if (tie.mihin == this.lahto)
            kohde = tie.mista;

          let uusireitti : Reitti=
            {
            "kuljettuReitti": this.lahto+kohde,
            "linjat": [linjanNimi],
            "linjaparit" : [this.lahto+kohde],
            "kuljettuMatka": tie.kesto,
            "valmis":(kohde == this.maali)
            }
          
          this.reitit.push(uusireitti);
          this.lisaaLyhyinReitti(uusireitti);
        }
      }
    });
    
    let kesken = true;
    while(kesken){
      kesken = false;
      this.etsiLiittymat();
      this.reitit.forEach((reitti)=> {
        let km = this.lyhinReitti[0].kuljettuMatka;
        if(km != null && km <= reitti.kuljettuMatka){
          reitti.valmis = true;
        }
        if(!reitti.valmis){
          kesken = true;
        }
      });
    }

    let t1 = performance.now();
    console.log("suoritusaika", (t1-t0)," ms");
    console.log(this.reitit);
  }

  etsiLiittymat = () : void => {
    this.reitit.forEach((reitti) => {

      if(!reitti.valmis){
        let nykyinenAsema = reitti.kuljettuReitti.substr(-1);
        let reittiStr = reitti.kuljettuReitti;
        let alkupMatka = null;
        let alkupParit = JSON.stringify(reitti.linjaparit);
        let yksiUusi = false;
        let alkupLinja = JSON.stringify(reitti.linjat);

        this.tiet.forEach((tie) => {


          let linjanNimi = this.tarkistaLinja(tie.mista,tie.mihin)
          if(linjanNimi != null){ //tie kuuluu johonkin linjaan
            let kohde = tie.mista;
            if (tie.mista == nykyinenAsema)
              kohde = tie.mihin;

            if(((tie.mista == nykyinenAsema && reittiStr.search(tie.mihin) == -1) || 
              (tie.mihin == nykyinenAsema && reittiStr.search(tie.mista) == -1)) && !yksiUusi){
                alkupMatka = reitti.kuljettuMatka;

                reitti.kuljettuReitti += kohde;
                reitti.linjat.push(linjanNimi);
                reitti.linjaparit.push(nykyinenAsema+kohde);
                reitti.kuljettuMatka += tie.kesto;
                reitti.valmis = (kohde == this.maali)
                yksiUusi = true;

                this.lisaaLyhyinReitti(reitti);
            }else if(((tie.mista == nykyinenAsema && reittiStr.search(tie.mihin) == -1) || 
              (tie.mihin == nykyinenAsema && reittiStr.search(tie.mista) == -1)) && yksiUusi){
                if(this.tarkistaLinja(nykyinenAsema,kohde)){
                  let uusireitti : Reitti =
                  {
                    "kuljettuReitti": reittiStr+kohde,
                    "linjat": JSON.parse(alkupLinja),
                    "linjaparit": JSON.parse(alkupParit),
                    "kuljettuMatka": alkupMatka + tie.kesto,
                    "valmis": (kohde == this.maali)
                  }

                uusireitti.linjaparit.push(nykyinenAsema+kohde);

                uusireitti.linjat.push(linjanNimi);
                this.reitit.push(uusireitti);
                this.lisaaLyhyinReitti(uusireitti);
              }
            }
          }
        });
      
        if(!yksiUusi && !reitti.valmis){
          //ei lisätty uusia pysäkkejä niin voidaan olettaa että kyseinen reitti päätyi umpikujaan
          let i = this.reitit.indexOf(reitti);
          delete this.reitit[i];
        }
      }
    });
  }

  lisaaLyhyinReitti = (reitti) : void  => { //onko reitti valmis ja lyhyempi mitä nykyinen lyhyin
    if(reitti.valmis){
      if(this.lyhinReitti[0].kuljettuMatka == null){
        this.lyhinReitti[0] = reitti;
      } else if(this.lyhinReitti[0].kuljettuMatka != null && reitti.kuljettuMatka <= this.lyhinReitti[0].kuljettuMatka){
        if(reitti.kuljettuMatka == this.lyhinReitti[0].kuljettuMatka) {
          this.lyhinReitti.push(reitti);
        } else {
          this.lyhinReitti = [];
          this.lyhinReitti[0] = reitti;
        }
      }
    }
  }

  tarkistaLinja = (lahto,mihin) : string => {
    let result = null;
  
    Object.getOwnPropertyNames(this.linjastot).forEach((linja) => {
      let linjaValues = this.linjastot[linja];

      if(linjaValues.includes(lahto)){ //löytyi linja missä on haluttu lähtöpaikka
        let lahtoIndex = linjaValues.indexOf(lahto);
        if(linjaValues[lahtoIndex-1] == mihin || linjaValues[lahtoIndex+1] == mihin){ //tarkistetaan että löytyykö linjalta reittiä välille A-B
          result = linja;
        }
      }
    });
    return result;
  }


}
