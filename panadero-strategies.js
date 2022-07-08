// * * *     *       *   *       *   *   *   * *** *
// *    *       *     *      *   *       *   *     *
// *   MODULE : panadero-strategies.js           * *  
// *   Location i5v0/build/panadero-strategies   * * 
// *   Modified :JaWsome.Orbit   *                 * 
// *   Date:    28 jun 2022             *          *
// *   Version: v1.0.1.            *        *      *
// ** *     *       *   *       *   *   *   *     **
// * *  *       *     *      *   *       *  *  * * *

/**
 * Trading Strategies 
 * 
 *  
 */

"use strict"; 

class panaderoStrategies {
  constructor(_name="name", _code="code") {
    this.name = _name;
    this.code = _code;
  }

/** calcSlots 1 : Default Grid 
 * these are equal steps
 * copied from botsTrading
*/
async calcRegularGrid (e) {
    var T = this;
    var o=e.objective;
    var c=e.change/100
    var ic=e.i_change/100
    var m=e.margin/100;
    var im=e.i_margin/100;
    var s=e.actual_slot;
    var sMax=e.max_slots;
    var q=e.q_per_slot;
    var aS=[];

    return new Promise(resolve => {
      const check = async () => {
        try {
          for (var i=1; i<=sMax; i++) {
            let buy=o;
            let sell=buy*(1+m);
            aS.push({'slot':i,'buy':buy.toFixed(e.digits),'sell':sell.toFixed(e.digits),'order':''});
            o*=(1-c);
            c+=ic;
            m+=im;
          }
          if (s>0){
            aS[s-1].order='sell';
            e.sellProfit = ((aS[s-1].sell - aS[s-1].buy)*e.q_per_slot*0.998).toFixed(8); //(0.2% comission)
            e.sell_at=aS[s-1].sell;
          }
          if (s<sMax){
            aS[s].order='buy';
            e.buy_at=aS[s].buy;
          }
          resolve(aS);
        } catch (err) {
    //      console.log('errrrror.. calculating strategy1 ....',err); 
          process.exit(1);
          }
        }
        check();
    })
  }

/** calcSlots 2 : Parabolic Grid
 * increasing steps to boundaries
 * copied from bots: p0ng
*/
  async calcAdvancedGrid (e) {
    var T = this;
    var o=e.objective;
    var c=e.change;
    var m=e.margin;
    var ci=e.i_change;
    var mi=e.i_margin;
    var mx=e.max_slots;
    var q=e.q_per_slot;
    var sl=e.actual_slot;
    var aS=[];

    return new Promise(resolve => {
      const check = async () => {
        try {
          // set midslot
          var b = o * (1-(m/200));
          var s = o * (1+(m/200));
          var mid=parseInt(mx/2)+1;
          var b1=b, s1=s, c2=c, m2=m;
          aS.push({'slot':mid,'buy':b.toFixed(e.digits),'sell':s.toFixed(e.digits),'p':((s-b)*q).toFixed(8)});
          // go up 
          for (var i = mid-1; i >0; i--) {
            b1 *=(1+((c+=ci)/100)); 
            s1 = b1 * (1+((m+=mi)/100));
            aS.push({'slot':i,'buy':b1.toFixed(e.digits),'sell':s1.toFixed(e.digits),'p':((s1-b1)*q).toFixed(8)});
          }
          // go down
          for (var i = mid+1; i <= mx; i++) {
            b *=(1-((c2+=ci)/100)); 
            s = b * (1+((m2)/100));
            aS.push({'slot':i,'buy':b.toFixed(e.digits),'sell':s.toFixed(e.digits),'p':((s-b)*q).toFixed(8)});
          }
          aS.sort(function(a, b){return a.slot - b.slot});

      // set slot.order= sell  at slot - 1
           if (sl>0){
              aS[sl-1].order='sell';
      // set sellprofit
              e.sellProfit =  (aS[sl-1].p *0.998).toFixed(8); //(0.2% comission)

      // set e.sell_at  
              e.sell_at=aS[sl-1].sell;
            }

            if (sl<mx){
      // set slot.order =buy
              aS[sl].order='buy';
      // set e.buy_at
              e.buy_at=aS[sl].buy;
           }
           resolve(aS);
        } catch (err) {
          console.log('errrrror.. calcSlot2....'+ err); 
          process.exit(1);
        }
      }
      check();
    });
  }

/** SignalTrading
 * signals provided by ioSocket
 * 
*/
async calcRegularSignal (e) {
  const check = async () => {
        try {
           resolve();
        } catch (err) {
          console.log('errrrror.. this is not good calcRegularSignal() ....'+ err); 
          process.exit(1);
        }
      }
      check();
    }

/** PairsTrading
 * signals provided by ioSocket
 * 
*/
async calcPairsTrading (e) {
}

/** Short - Long strategy
 * see Alpaca scripts
 * 
*/
async calcShortLong (e) {
}

/** SignalTrading
 * signals provided by TradingView
 * 
*/
async calcTradingViewSignal1 (e) {
}

/** SignalTrading
 * signals provided by TradingView
 * 
*/
async calcTradingViewSignal2 (e) {
}


}

module.exports = panaderoStrategies;