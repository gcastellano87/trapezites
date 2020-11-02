import { DatRange } from './utils/dat_range.js';
import { Dat } from './utils/dat.js';
import { RangedItems } from './utils/ranged_items.js';
import { RangedCoins } from './utils/ranged_coins.js';

export class Tests  {
    constructor(mode){
        if(mode != 'quiet'){
            this.run();
        }
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
        console.log('>>>>>-------------------------   DAT VARIABLES -----------------------<<<<<');
        
        console.log('dat800bc:', dat800bc.string); 
        console.log('dat500bc:', dat500bc.string); 
        console.log('dat300bc:', dat300bc.string); 
        console.log('dat600ad:', dat600ad.string); 
        console.log('dat700ad:', dat700ad.string); 
 

        window.datr500300   = new DatRange({start: dat500bc, end:dat300bc});
        window.datr800500   = new DatRange({start: dat800bc, end:dat500bc});
        window.datr300700ad = new DatRange({start: dat300bc, end:dat700ad});
        window.datr800700ad = new DatRange({start: dat800bc, end:dat700ad});
        window.datr500600ad = new DatRange({start: dat500bc, end:dat600ad});

        console.log('>>>>>-------------------------   DAT RANGE VARIABLES -----------------------<<<<<');
        
        console.log('datr500300',datr500300.string);
        console.log('datr800500',datr800500.string);
        console.log('datr300700ad',datr300700ad.string);
        console.log('datr800700ad',datr800700ad.string);
        console.log('datr500600ad',datr800500.string);

    }

    dat_tests(){
        console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
        console.log('------------------------------   DATS  ------------------------------');
        console.log('vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv');

        console.log('>>>>>-------------------------   DAT.after -----------------------<<<<<');
        
        console.log('dat800bc.after(dat500bc) is:',dat800bc.after(dat500bc), ' Should be: false');
        console.log('dat500bc.after(dat800bc) is:',dat500bc.after(dat800bc), ' Should be: true');
        console.log('dat500bc.after(dat500bc) is:',dat500bc.after(dat500bc), ' Should be: false');
        
        console.log('>>>>>-------------------------   DAT.before -----------------------<<<<<');

        console.log('dat800bc.before(dat500bc) is:',dat800bc.before(dat500bc), ' Should be: true');
        console.log('dat500bc.before(dat800bc) is:',dat500bc.before(dat800bc), ' Should be: false');
        console.log('dat500bc.before(dat500bc) is:',dat500bc.before(dat500bc), ' Should be: false');

        console.log('>>>>>-------------------------   DAT.equal_or_before -----------------------<<<<<');
        
        console.log('dat500bc.equal_or_before(dat500bc) is:',dat500bc.equal_or_before(dat500bc), ' Should be: true');
        console.log('dat500bc.equal_or_before(dat700ad) is:',dat500bc.equal_or_before(dat700ad), ' Should be: true');
        console.log('dat500bc.equal_or_before(dat800bc) is:',dat500bc.equal_or_before(dat800bc), ' Should be: false');        
        console.log('>>>>>-------------------------   DAT.equal_or_after -----------------------<<<<<');
        
        console.log('dat500bc.equal_or_after(dat500bc) is:',dat500bc.equal_or_after(dat500bc), ' Should be: true');
        console.log('dat500bc.equal_or_after(dat700ad) is:',dat500bc.equal_or_after(dat700ad), ' Should be: false');
        console.log('dat500bc.equal_or_after(dat800bc) is:',dat500bc.equal_or_after(dat800bc), ' Should be: true');
        
        console.log('>>>>>-------------------------   Dat.equals -----------------------<<<<<');
        
        console.log('dat500bc.equals(dat500bc) is:',dat500bc.equals(dat500bc), ' Should be: true');
        console.log('dat500bc.equals(dat700ad) is:',dat500bc.equals(dat700ad), ' Should be: false');
        console.log('dat500bc.equals(dat800bc) is:',dat500bc.equals(dat800bc), ' Should be: false');
        
        console.log('>>>>>-------------------------   DAT.compare -----------------------<<<<<');
        
        console.log('dat500bc.compare(dat500bc) is:',dat500bc.compare(dat500bc), ' Should be: 0');
        console.log('dat500bc.compare(dat700ad) is:',dat500bc.compare(dat700ad), ' Should be: -x');
        console.log('dat500bc.compare(dat800bc) is:',dat500bc.compare(dat800bc), ' Should be: +x');
        
    }

    dat_range_tests(){
        console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
        console.log('------------------------------ DAT RANGES -------------------------------');
        console.log('vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv');
        
        console.log('>>>>>-------------------------   DATRANGE.duration -----------------------<<<<<');
        
        console.log('datr800700ad.duration is:',datr800700ad.duration, ' Should be: 1500');

        console.log('>>>>>-------------------------   DATRANGE.starts_before -----------------------<<<<<');
        console.log('- - - - - - - - - - - - - - -    DAT  - - - - - - - - - - ');
        
        console.log('datr500600ad.starts_before(dat300bc) is:',datr500600ad.starts_before(dat300bc), ' Should be: true');
        console.log('datr500600ad.starts_before(dat800bc) is:',datr500600ad.starts_before(dat800bc), ' Should be: false');
        console.log('datr500600ad.starts_before(dat500bc) is:',datr500600ad.starts_before(dat500bc), ' Should be: false');        
        
        console.log('- - - - - - - - - - - - - - -    DATRANGE - - - - - - - - - - ');
        
        console.log('datr500600ad.starts_before(datr300700ad) is:',datr500600ad.starts_before(datr300700ad), ' Should be: true');
        console.log('datr500600ad.starts_before(datr800700ad) is:',datr500600ad.starts_before(datr800700ad), ' Should be: false');
        console.log('datr500600ad.starts_before(dat500bc) is:',datr500600ad.starts_before(dat500bc), ' Should be: false');        
        
        console.log('>>>>>-------------------------   DATRANGE.ends_after -----------------------<<<<<');
        console.log('- - - - - - - - - - - - - - -    DAT  - - - - - - - - - - ');
        
        console.log('datr500600ad.ends_after(dat300bc) is:',datr500600ad.ends_after(dat300bc), ' Should be: true');
        console.log('datr500600ad.ends_after(dat700ad) is:',datr500600ad.ends_after(dat700ad), ' Should be: false');
        console.log('datr500600ad.ends_after(dat600ad) is:',datr500600ad.ends_after(dat600ad), ' Should be: false');        
        
        console.log('- - - - - - - - - - - - - - -    DATRANGE - - - - - - - - - - ');
        
        console.log('datr500600ad.ends_after(datr500300) is:',datr500600ad.ends_after(datr500300), ' Should be: true');
        console.log('datr500600ad.ends_after(datr300700ad) is:',datr500600ad.ends_after(datr300700ad), ' Should be: false');
        console.log('datr300700ad.ends_after(datr800700ad) is:',datr300700ad.ends_after(datr800700ad), ' Should be: false');

        console.log('>>>>>-------------------------   DATRANGE.starts_same_or_before -----------------------<<<<<');

        console.log('- - - - - - - - - - - - - - -    DAT  - - - - - - - - - - ');
        
        console.log('datr500600ad.starts_same_or_before(dat800bc) is:',datr500600ad.starts_same_or_before(dat800bc), ' Should be: false');
        console.log('datr500600ad.starts_same_or_before(dat700ad) is:',datr500600ad.starts_same_or_before(dat700ad), ' Should be: true');
        console.log('datr500600ad.starts_same_or_before(dat500bc) is:',datr500600ad.starts_same_or_before(dat500bc), ' Should be: true');        
        
        console.log('- - - - - - - - - - - - - - -    DATRANGE - - - - - - - - - - ');
        
        console.log('datr500600ad.starts_same_or_before(datr500300) is:',datr500600ad.starts_same_or_before(datr500300), ' Should be: true');
        console.log('datr500600ad.starts_same_or_before(datr300700ad) is:',datr500600ad.starts_same_or_before(datr300700ad), ' Should be: true');
        console.log('datr300700ad.starts_same_or_before(datr800700ad) is:',datr300700ad.starts_same_or_before(datr800700ad), ' Should be: false');        
        
        console.log('>>>>>-------------------------   DATRANGE.ends_same_or_after -----------------------<<<<<');
        console.log('- - - - - - - - - - - - - - -    DAT  - - - - - - - - - - ');
        
        console.log('datr500600ad.ends_same_or_after(dat300bc) is:',datr500600ad.ends_same_or_after(dat300bc), ' Should be: true');
        console.log('datr500600ad.ends_same_or_after(dat700ad) is:',datr500600ad.ends_same_or_after(dat700ad), ' Should be: false');
        console.log('datr500600ad.ends_same_or_after(dat600ad) is:',datr500600ad.ends_same_or_after(dat600ad), ' Should be: true');        
        
        console.log('- - - - - - - - - - - - - - -    DATRANGE - - - - - - - - - - ');
        
        console.log('datr500600ad.ends_same_or_after(datr500300) is:',datr500600ad.ends_same_or_after(datr500300), ' Should be: true');
        console.log('datr500600ad.ends_same_or_after(datr300700ad) is:',datr500600ad.ends_same_or_after(datr300700ad), ' Should be: false');
        console.log('datr300700ad.ends_same_or_after(datr800700ad) is:',datr300700ad.ends_same_or_after(datr800700ad), ' Should be: true');

        console.log('>>>>>-------------------------   DATRANGE.CONTAINS -----------------------<<<<<');
        console.log('- - - - - - - - - - - - - - -    DAT - - - - - - - - - - ');
        console.log('datr800700ad.contains(dat500bc) is:',datr800700ad.contains(dat500bc), ' Should be: true');
        console.log('datr800700ad.contains(dat800bc) is:',datr800700ad.contains(dat800bc), ' Should be: true');
        console.log('datr800500.contains(dat700ad) is:',datr800500.contains(dat700ad), ' Should be: false');

        console.log('- - - - - - - - - - - - - - -    DATRANGE - - - - - - - - - - ');
        
        console.log('datr800700ad.contains(datr500300) is:',datr800700ad.contains(datr500300), ' Should be: true');
        console.log('datr800700ad.contains(datr800500)',datr800700ad.contains(datr800500), ' Should be: true');
        console.log('datr800500.contains(datr800700ad)',datr800500.contains(datr800700ad), ' Should be: false');
        
        console.log('>>>>>-------------------------   DATRANGE.CONTAINS_EXCLUSIVE -----------------------<<<<<');
        console.log('- - - - - - - - - - - - - - -    DAT - - - - - - - - - - ');
        console.log('datr800700ad.contains_exclusive(dat500bc) is:',datr800700ad.contains_exclusive(dat500bc), ' Should be: true');
        console.log('datr800700ad.contains_exclusive(dat800bc) is:',datr800700ad.contains_exclusive(dat800bc), ' Should be: false');
        console.log('datr800500.contains_exclusive(dat700ad) is:',datr800500.contains_exclusive(dat700ad), ' Should be: false');

        console.log('- - - - - - - - - - - - - - -    DATRANGE - - - - - - - - - - ');
        
        console.log('datr800700ad.contains_exclusive(datr500300) is:',datr800700ad.contains_exclusive(datr500300), ' Should be: true');
        console.log('datr800700ad.contains_exclusive(datr800500)',datr800700ad.contains_exclusive(datr800500), ' Should be: false');
        console.log('datr800500.contains_exclusive(datr800700ad)',datr800500.contains_exclusive(datr800700ad), ' Should be: false');
        
        console.log('>>>>>-------------------------   DATRANGE.OVERLAPS -----------------------<<<<<');

        console.log('- - - - - - - - - - - - - - -    DATRANGE - - - - - - - - - - ');        
        console.log('.   .   .   .   .   .   .   .  . contained .   .   .   .   .   .    ');
        console.log('datr800700ad.overlaps(datr500300) is:',datr800700ad.overlaps(datr500300), ' Should be: true');
        console.log('datr500300.overlaps(datr800700ad)',datr500300.overlaps(datr800700ad), ' Should be: true');
        console.log('.   .   .   .   .   .   .   .    starts same, end diff  .   .   .   .   .   .    ');
        console.log('datr800700ad.overlaps(datr800500) is:',datr800700ad.overlaps(datr800500), ' Should be: true');
        console.log('datr800500.overlaps(datr800700ad)',datr800500.overlaps(datr800700ad), ' Should be: true');
        console.log('.   .   .   .   .   .   .   .    starts diff, ends same  .   .   .   .   .   .    ');
        console.log('datr800700ad.overlaps(datr300700ad) is:',datr800700ad.overlaps(datr300700ad), ' Should be: true');
        console.log('datr300700ad.overlaps(datr800700ad)',datr300700ad.overlaps(datr800700ad), ' Should be: true');
        console.log('.   .   .   .   .   .   .   .    starts diff, ends diff  .   .   .   .   .   .    ');
        console.log('datr500600ad.overlaps(datr300700ad) is:',datr500600ad.overlaps(datr300700ad), ' Should be: true');
        console.log('datr300700ad.overlaps(datr500600ad)',datr300700ad.overlaps(datr500600ad), ' Should be: true');
        console.log('.   .   .   .   .   .   .   .    no overlap, with gap  .   .   .   .   .   .    ');
        console.log('datr800500.overlaps(datr300700ad) is:',datr800500.overlaps(datr300700ad), ' Should be: false');
        console.log('datr300700ad.overlaps(datr800500)',datr300700ad.overlaps(datr800500), ' Should be: false');
        console.log('.   .   .   .   .   .   .   .    no overlap, contiguous  .   .   .   .   .   .    ');
        console.log('datr800500.overlaps(datr500600ad) is:',datr800500.overlaps(datr500600ad), ' Should be: IDONTKNOW');
        console.log('datr500600ad.overlaps(datr800500)',datr500600ad.overlaps(datr800500), ' Should be: IDONTKNOW');     
                
    }

    ranged_items_tests(){

    }

}
