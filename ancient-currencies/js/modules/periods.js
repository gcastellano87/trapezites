/*-------------------------------------------*/
/*---------------- PERIODS ------------------*/
/*-------------------------------------------*/
export const Period = {
    'id': '',
    'start_date': '',
    'end_date': ''
}

export const Periods = {
	selected_period: {}, 
    list: [],
    filters: [], // Not currently used
    initialize: function(coins_json){
        console.log('initializing periods');
        Periods.initialize_list(coins_json);
        Periods.build_dropdown();
    },
    initialize_list: function(coins) {
        console.log('building periods list');
        // find min and max dates
        let minYear = 9999;
        let minSuf = 'AD';
        let maxYear = 9999;
        let maxSuf = 'BC';

        for (let item of coins) {
            if (Periods.compare_years(item['start_date_year'],item['start_date_suf'],
                             minYear, minSuf) < 0) {
                minYear = item['start_date_year'];
                minSuf = item['start_date_suf'];
            }
            if (Periods.compare_years(item['end_date_year'],item['end_date_suf'],
                             maxYear, minSuf) > 0) {
                maxYear = item['end_date_year'];
                maxSuf = item['end_date_suf'];
                //console.log(maxYear);
                //console.log(maxSuf);
            }
        }
        let min = minYear+' '+minSuf;
        let max = maxYear+' '+maxSuf;

         //console.log('min '+min);
         //console.log('max '+max);

        //round up or down
        minYear = Math.ceil(parseInt(minYear)/25)*25;
        maxYear = Math.ceil(parseInt(maxYear)/25)*25;
        min = minYear;
        max = maxYear;
        // console.log('rounded min '+min);
        // console.log('rounded max '+max);

        let result = [];
        let id = 0;
        while (Periods.compare_years(minYear, minSuf, maxYear, maxSuf) == -1){
            let prd = Object.create(Period);
            let periodEnd;
            prd['id'] = id;
            if (minSuf == 'BC') {
                periodEnd = minYear - 24;
                prd['start_date'] = min;
                prd['end_date'] = periodEnd;
                result.push(prd);
                minYear = minYear - 25;
                if (minYear == 0) {
                    minSuf = 'AD';
                }
            } else {
                periodEnd = minYear + 24;
                prd['start_date'] = min;
                prd['end_date'] = periodEnd;
                result.push(prd);
                minYear = minYear + 25;
            }
            min = minYear;
            id++;
        }
        console.log("the Periods: ", result);
        Periods.set_list(result);
    },
    set_list: function(new_list){
        Periods.list = new_list;
    },
    build_dropdown: function(){
        console.log('building periods dropdown');
        let id = 0;
        for (let item of Periods.get_filtered_list()) {
            let str = item['start_date']+' BC to '+item['end_date']+ ' BC';
            let tempHtml = $('<option value='+id+'>'+ str +'</option>');
            $(tempHtml).appendTo('.period .option-list');
            id++;
        }
    },
    get_list: function(){
        return Periods.list;
    },
    get_filtered_list: function(){
        let list = Periods.get_list();
        // Do we need to filter Periods ever?
        return list;
    },
    //compares years for building periods
    compare_years: function(num1,suf1,num2,suf2) {
        // console.log('comparing years '+num1+' '+suf1+' '+num2+' '+suf2);
        if (num1 == num2 && suf1 == suf2) {
            return 0;
        }
        else {
            if (suf1 == 'BC' && suf2 == 'AD') {
                return -1;
            }
            else if (suf1 == 'AD' && suf2 == 'BC') {
                return 1;
            }
            if (suf1 == 'BC' && suf2 == 'BC') {
                // console.log('both BC');
                return num1 > num2 ? -1 : 1;
            }
            else { //both AD
                return num1 < num2 ? -1 : 1;
            }
        }
    }
}