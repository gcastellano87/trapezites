import { DatRange } from './utils/dat_range.js';
import { Dat } from './utils/dat.js';
import { RangedItems } from './utils/ranged_items.js';
import { RangedCoins } from './utils/ranged_coins.js';

export class Tests  {
    constructor(){
        this.run();
    }

    run(){
        this.test_set_up();
        this.dat_tests();
        this.dat_range_tests();
        this.ranged_items_tests();
        
    }

    test_set_up(){

        window.dat800bc = new Dat(-800);
        window.dat500bc = new Dat('500 BC');
        window.dat300bc = new Dat('300 BC');
        window.dat600ad = new Dat('600 AD');
        window.dat700ad = new Dat(700);
 

        window.datr500300   = new DatRange({start: dat500bc, end:dat300bc});
        window.datr800500   = new DatRange({start: dat800bc, end:dat500bc});
        window.datr300700ad = new DatRange({start: dat300bc, end:dat700ad});
        window.datr800700ad = new DatRange({start: dat800bc, end:dat700ad});
        window.datr500600ad = new DatRange({start: dat500bc, end:dat600ad});
    }

    dat_tests(){

    }

    dat_range_tests(){

    }

    ranged_items_tests(){

    }

}
