import{ Tests } from './modules/tests.js';

var test = new Tests('quiet');

import { Standards }  from './modules/standards.js';
import { Regions }  from './modules/regions.js';
import { Periods }  from './modules/periods.js';
import { Coins } from './modules/coins.js';

/*-------------------------------------------*/
/*------------------ APP --------------------*/
/*-------------------------------------------*/
var App = {
    entries: [],
    canvas: '',
    ctx: '',
    map: '',
    map_scale: 1,
    initialize: function(){
        // var the_headers = new Headers();
        // the_headers.append('secret-key', '$2b$10$yjrD4Y8FJuGo2.cLYkzKP.FI6SCpY5GW8JUazMgOxXUnYi8Tf0MT2');

        // const request = new Request('https://api.jsonbin.io/b/5f04a20b343d624b07816015/4',  {   
        //     method: 'GET',
        //     headers: the_headers,
        // });

        // fetch(request).then(response => { return response.json()}).then(jsonResponse => {

        //     let entries = App.process_entries(jsonResponse);
        //     App.initialize_data_and_dropdowns(entries);
        //     App.add_listeners();
        // });
        let data = JSON.parse(document.getElementById('data').innerHTML);
         // DEBUGGIN ONLY
        // window.entries = data.entries;
        App.initialize_data_and_dropdowns(data.entries);
        App.initialize_select2();
        App.add_listeners();
        App.initialize_map();
    },
    initialize_map: function(){
        App.initialize_map_listeners();
        App.draw_map();
    },
    get_canvas: function(){
        if(!App.canvas){
            let canvas = document.getElementById('map');
            App.canvas = canvas;            
        }
        return App.canvas;
    },
    get_ctx: function(){
        if(!App.ctx){
            let canvas = App.get_canvas();
            let ctx = canvas.getContext('2d');
            App.ctx = ctx;
            
        }        
        return App.ctx;
    },
    draw_markers: function(){
        let from = Coins.selected_coin;
        let to = Standards.selected_standard;


        this.draw_map();

        if (from && to){
            this.draw_markers_and_connector(from.coords, to.coords);
        } else {
            if (from){
                this.draw_from_marker(from.coords);
            }
    
            if (to){
                this.draw_to_marker(to.coords);
            }
        }     
    },
    draw_from_marker: function(coords){
        let from_marker = new Image();
        from_marker.src = 'img/from-marker.png';
        
        from_marker.onload = function(){
            App.draw_marker(from_marker, coords);
        }
    },
    draw_to_marker: function(coords){
        let to_marker = new Image();
        to_marker.src = 'img/to-marker.png';
        // console.log('to marker coords',coords);
        
        to_marker.onload = function(){
            App.draw_marker(to_marker, coords);
        }
    },
    draw_marker: function(marker, coords){
        let ctx = this.get_ctx();
        let marker_width = marker.width*App.scale*0.6;
        let marker_height = marker.height*App.scale*0.6;
        
        let marker_width_offset = marker_width/2;
        let marker_height_offset = marker_height/2;
        let destination_x = (ctx.width*coords.percent_of_image_x)-marker_width_offset;
        let destination_y = (ctx.height*coords.percent_of_image_y)-marker_height_offset;

        ctx.drawImage(marker, destination_x, destination_y, marker_width, marker_height);
    },
    draw_markers_and_connector: function(from_coords, to_coords){
        //  get to location  
        // get from location
        // get both location coordinates
        // draw line between coordinates
        let ctx = this.get_ctx();
        let from_x = (ctx.width*from_coords.percent_of_image_x);
        let from_y = (ctx.height*from_coords.percent_of_image_y);      
        let to_x = (ctx.width*to_coords.percent_of_image_x);
        let to_y = (ctx.height*to_coords.percent_of_image_y);

        ctx.beginPath();
        ctx.moveTo(from_x,from_y);
        ctx.strokeStyle = "#e41651";
        ctx.lineWidth=5*App.scale;
        ctx.lineTo(to_x,to_y);
        ctx.stroke();
        ctx.closePath();

        App.draw_from_marker(from_coords);
        App.draw_to_marker(to_coords);

    },
    draw_map: function(){
        let canvas = App.get_canvas();
        let ctx = App.get_ctx();
        let display_area = document.getElementsByClassName('map')[0];
        ctx.width = display_area.offsetWidth;

        if(!App.map){
            let map = new Image();
            map.src = 'img/map.png';
            App.map = map;
            map.onload = function(){
                // get the width of the area where the map will be displayed
                App.render_map(map, ctx,canvas);
            }
        }

        App.render_map(this.map, ctx,canvas); 
    },
    render_map: function(map, ctx, canvas){
        let map_aspect_ratio    =   (map.height/map.width);
        ctx.height              =   ctx.width*map_aspect_ratio;
        App.scale               =   ctx.width/map.width;
        
        canvas.width            =   ctx.width;
        canvas.height           =   ctx.height;
        ctx.drawImage(map, 0, 0, ctx.width, ctx.height);
    },
    initialize_map_listeners: function(){
        window.onresize = App.draw_map();
    },
    format_state_for_select2: function(state){
        // console.log(state);
        if(state.text.includes('    ')){
            let parts = state.text.split('    ');
            return $('<span class="currency-option-item"><span class="denomination">' + parts[0] + '</span><span class="location">' + parts[1] + '</span></span>');
        } else if (state.text.includes('   ')){
            let parts = state.text.split('   ');
            return $('<span class="standard-option-item"><span class="standard">' + parts[0] + '</span><span class="location">' + parts[1] + '</span><span class="period">' + parts[2] + '</span></span>');
        } else {
            return state.text;
        }
    },
    initialize_select2: function(){
        // console.log("FORMAT");
       $('.currencies .option-list').select2({
           templateResult: App.format_state_for_select2,
           theme: 'currencies',
           sorter: App.sort_currency_for_select2,
        //    width: 'width: 500px'
        });       
        
        $('.filters .option-list').select2({
           templateResult: App.format_state_for_select2,
           theme: 'filters',
        //    width: 'width: 200px'
        });

    },
    sort_currency_for_select2: function(data){
        return data.sort(function(a,b){
            // console.log('1');        
            if(a.text && b.text){
                if(a.text.includes('    ')){
                    let a_parts = a.text.split('    ');
                    let b_parts = b.text.split('    ');
                    // console.log('three')        

                    return a_parts[1] < b_parts[1] ? -1 : a_parts[1] > b_parts[1] ? 1 : 0;
                } else if (a.text.includes('   ')){ 
                    let a_parts = a.text.split('   ');
                    let b_parts = b.text.split('   ');
                    // console.log('four')        

                    return a_parts[1] < b_parts[1] ? -1 : a_parts[1] > b_parts[1] ? 1 : 0;
                } else {
                    // console.log('five')        

                    return 0;
                }
            } else {
                // console.log('six')        

                return 0;
            }
        });
    },
    add_listeners: function(){
        $('.about').click(function(){
            $('body').toggleClass('modal-open');
        });        
        
        $('.close-modal').click(function(){
            $('body').removeClass('modal-open');
        });

        $('.currency-from .option-list').change(function() {           
            let id = $(this).children('.option-list :selected').val();

            if (id){
                Coins.selected_coin = Coins.get_coin_by_id(id);
            } else {
                Coins.selected_coin = '';
            }
            Standards.build_dropdown();
            Coins.build_dropdown();
            App.convert_or_show_errors();
            App.draw_markers();
        });

        $('.standard-to .option-list').change(function() {
            // console.log('in standard optionlist listener');
            let id = $(this).children('.option-list :selected').val();
            if (id){
                Standards.selected_standard = Standards.get_standard_by_id(id);
            } else {
                Standards.selected_standard = '';
            }
            Coins.build_dropdown();
            Standards.build_dropdown();
            App.convert_or_show_errors();
            App.draw_markers();
        });

        $('.region-selector-from .option-list').change(function() {
            let region_id = $(this).children('.option-list :selected').val();
            Regions.selected_region = Regions.get_region_by_id(region_id);

            // console.log("THE SELECTED Region", Regions.selected_region);
            Coins.set_region_filter(Regions.selected_region);
            Coins.build_dropdown();
            App.convert_or_show_errors();
            App.draw_markers();
        });

        $('.period-selector .option-list').change(function() {
            let id = $(this).children('.option-list :selected').val();
            Periods.selected_period = Periods.list[id];
            // console.log("THE SELECTED PERIOD", Periods.selected_period);
            Coins.set_period_filter(Periods.selected_period);
            Coins.build_dropdown();
            Standards.set_period_filter(Periods.selected_period);
            Standards.build_dropdown();
            App.convert_or_show_errors();
            App.draw_markers();
        });        
        
        $('.region-selector-to .option-list').change(function() {
            let region_id = $(this).children('.option-list :selected').val();
            Regions.selected_region = Regions.get_region_by_id(region_id);
            Standards.set_region_filter(Regions.selected_region);
            Standards.build_dropdown();
            App.convert_or_show_errors();
            App.draw_markers();
        });

        $('.currency-from .amount-selector').keyup(function(){
            this.value = this.value.replace(/[^0-9\.]/g,'');
            App.convert_or_show_errors();
        });                
    },
    display_selected_standard(results,display_denomination = true){
        var output = '';
        results.forEach(result => {
            
            output += '<li class="coin">';
            output += '    <div class="main expand-citations-and-links">';
            output += '      <span class="expand"  aria-label="Expand or Collapse"></span>';
         
            output += '      <span class="group">';
            output += '        <span class="number">'       + ( result.number > 1 ? Math.round(result.number * 100) / 100 :  result.number.toPrecision(2) ) + '</span>';
        if (display_denomination){
            output += '        <span class="denomination">' + result.coin.denomination              + '(s)</span>';
        } else {
            output += '        <span> units</span>';

        }
            output += '      </span> <!-- group -->';
         
            output += '      <span class="group region">'       + result.coin.region                    + '</span>';
            output += '      <span class="group">';
            output += '        <span class="location">'     + result.coin.location                  + ',</span>';
            output += '        <span class="date-range">'   + result.coin.range.as_string()         + '</span>';
            output += '      </span>';
            output += '     <span class="group links">(citations and links)</span>';            
            output += '    </div>';

            output += '  <div class="citations-and-links expandable">';
            output +=       App.generate_image_html(result.coin);
            output +=       "<p>Material: " + result.coin.material + "</p>";
            output +=       "<p>Weight: " + (result.coin.weight_in_grams ? (result.coin.weight_in_grams + " g" ) : "N/A") + "</p>";
            output +=       "<p>Value: " + result.coin.value_in_grams_of_silver + " g of silver</p>";
            output += '     <div class="links">';
        if (result.coin.pleiades_id || result.coin['nomisma_(mint)'] || result.coin.coin_examples || result.coin.perseus_uri_1|| result.coin['nomisma_(denomination)'] ||result.coin['nomisma_(material)'] || result.coin.notes){
            output += '     <h4 class="source-title">Links</h4>';
            output += '       <ul>';
            output +=             App.link_output('Coin Example', result.coin.coin_examples,true);
            output +=             App.link_output('Pleiades', result.coin.pleiades_id,true);
            output +=             App.link_output('Nomisma (mint)',result.coin['nomisma_(mint)'],true);
            output +=             App.link_output('Nomisma (denomination)',result.coin['nomisma_(denomination)'],true);
            output +=             App.link_output('Nomisma (material)',result.coin['nomisma_(material)'],true);
            output +=             App.link_output('Perseus Digital Library', result.coin.perseus_uri_1,true,result.coin.perseus_citation_1);
            output +=             App.link_output('Perseus Digital Library', result.coin.perseus_uri_2,true,result.coin.perseus_citation_2);
            output +=             App.link_output('Perseus Digital Library', result.coin.perseus_uri_3,true,result.coin.perseus_citation_3);
            output +=             App.link_output('Notes',result.coin.notes, false);
            output +=        '</ul>';
        }
            output += '    </div>';            
            
        if (result.coin.source_1){
            output += '    <div class="sources">';
            output += '    <h4 class="source-title">Bibliography</h4>';
            output += '       <ul>';
            output +=          App.source_output(result.coin.source_1);
            output +=          App.source_output(result.coin.source_2);
            output +=          App.source_output(result.coin.source_3);
            output +=          App.source_output(result.coin.source_4);
            output += '       </ul>';
            output += '    </div>';
        }

            output += '  </div>';
            output += '</li>';            
        });

        return output;
    },
    generate_image_html(coin){
        let obverse = coin.coin_image_obverse;
        let reverse = coin.coin_image_reverse;
        let html = '';

        if (obverse || reverse){
            html += '<div class="coin-images">';
            if (obverse){


                html += '<figure>';
                html += '  <img src="img/coins/'+ obverse +'" alt="Obverse image of coin">';
                html += '  <figcaption>Obverse</figcaption>';
                html += '</figure>';
            } 
            if (reverse){
                html += '<figure>';
                html += '  <img src="img/coins/'+ reverse +'" alt="reverse image of coin">';
                html += '  <figcaption>Reverse</figcaption>';
                html += '</figure>';
            }
            html += '</div>';
        }
        return html;
    },
    get_json_ld(coin_url, coin_id){
        let json = {};
        const headz = new Headers();
        // console.log(coin_url + '.jsonld');
        fetch(coin_url + '.jsonld', {
                method: 'GET',
                headers: headz,
                mode: 'no-cors',
                cache: 'default',
            })
            .then(response => {
                if (response.status !== 200){
                    // console.log('Error: ' + response.status);
                    return;
                }
                response.json().then(data => {
                    // console.log(data);
                });
            });
    },
    source_output(source){
        let html = "";
        if (source){
            html += '<li class="source">';
            html +=   source.replaceAll('\[\[','<span class="book-title">').replaceAll('\]\]','</span>');
            html += '</li>';
        }
        return html;
    },
    convert(amount){
        let coins_value             = Coins.selected_coin.value_in_grams_of_silver;
        let total_value_of_coins    = amount*coins_value;
        let conversion_results      = Standards.selected_standard.coin_conversion(total_value_of_coins);
        let contemporary_standards = Standards.get_standards_by_range(Coins.selected_coin.range);
        let contemporary_commodities = Coins.get_commodities_by_range(Coins.selected_coin.range);

        let html = '<h2 class="conversion-title">'+ amount + ' ' + Coins.selected_coin.denomination + ' (' + ( Math.round(total_value_of_coins * 100) / 100 ) + ' g of silver) in ' + Coins.selected_coin.location + ' between ' + Coins.selected_coin.range.as_string() + ' converted to...</h2>';
        html += '   <ul class="list-of-conversion-types">';

        html += '     <li class="conversion-type open">';
        html += '       <h3 class="output-title">the selected standard:<span class="expand-list-of-conversions" aria-label="Expand or Collapse"></span></h3>';
        html += '       <ul class="list-of-conversions selected-standard">';
        html += '         <li class="conversion">';
        html += '           <h4 class="selected-standard-title">' + Standards.selected_standard.standard_version_name + '</h4>';
        html += '           <ul class="list-of-coins">' + App.display_selected_standard(conversion_results) + '</ul>';
        html += '         </li>';
        html += '       </ul>';
        html += '     </li>';

if (contemporary_commodities.length > 0){   
        html += '     <li class="conversion-type">';
        html += '       <h3 class="output-title">Contemporary Commodities (' + contemporary_commodities.length + '):<span class="expand-list-of-conversions" aria-label="Expand or Collapse"></span></h3>';
        html += '       <ul class="list-of-conversions">';

    contemporary_commodities.forEach(commodity => {
        html += '         <li class="conversion">';
        html += '           <h4 class="selected-standard-title">' + commodity.denomination + '</h4>';
        html += '           <ul class="list-of-coins">' + App.display_selected_standard(Coins.currency_conversion(commodity,total_value_of_coins),false) + '</ul>';
        html += '         </li>';
    });

        html += '       </ul>';
        html += '     </li>';
       
}

    if(contemporary_standards.length > 0){
        html += '     <li class="conversion-type">';
        html += '       <h3 class="output-title">other contemporary standards from ' + Coins.selected_coin.range.as_string() + '('+contemporary_standards.length +'):<span class="expand-list-of-conversions" aria-label="Expand or Collapse"></span></h3>';
        html += '       <ul class="list-of-conversions">';

    contemporary_standards.forEach(standard => {
        html += '         <li class="conversion">';
        html += '           <h4 class="selected-standard-title">' + standard.standard_version_name + '</h4>';
        html += '           <ul class="list-of-coins">' + App.display_selected_standard(standard.coin_conversion(total_value_of_coins)) + '</ul>';
        html += '         </li>';
    });

        html += '       </ul>';
        html += '     </li>';
    }   

        $(html).appendTo('.conversion-output');

       
        App.attach_output_listeners();
    },
    link_output(title,content,content_is_url=false,link_text =''){
        let html = '';
        if(content){
                html += '<li class="citation-or-link">';
                html += '<span class="citation-title">' + title + ': </span><span class="citation-content">';
            if (content_is_url){
                html += '    <a href="' + content +'">';
            }
            if (link_text){
                html += link_text;
            } else {
                html +=         content;
            }
            if (content_is_url){
                    html += '    </a>';
            }
                html += '  </span>';
                html += '</li>'; 
        }
        return html;
    },
    convert_or_show_errors(){
        let currency_from = $('.currency-from .option-list :selected').val();
        let currency_to = $('.standard-to .option-list :selected').val();
        let amount = $('.currency-from .amount-selector').val();
        let number_missing = 0;
        $('.conversion-output').empty();


        if(currency_from && currency_to && amount){
            App.convert(amount);
        } 

        if (!currency_from ){
            number_missing++;
            $('.currency-from .select2-container--currencies').addClass('warning-empty');
        } else {
            $('.currency-from .select2-container--currencies').removeClass('warning-empty');
        } 
        
        if (!currency_to ){
            number_missing++;
            $('.standard-to .select2-container--currencies').addClass('warning-empty');
        } else {
            $('.standard-to .select2-container--currencies').removeClass('warning-empty');
        }

        if (!amount ){
            number_missing++;
            $('.amount-selector').addClass('warning-empty');
        } else {
            $('.amount-selector').removeClass('warning-empty');
        }

        if(number_missing > 0){
            $('.convert').addClass('missing-inputs');
        } else {
            $('.convert').removeClass('missing-inputs');
        }

        $('.convert').attr('data-missing',number_missing);
        

    },
    attach_output_listeners(){
        $('.expand-citations-and-links').on('click', function(event){
            event.preventDefault();            
            $(this).parents('.coin').toggleClass('open');
        });

        $('.output-title').on('click', function(event){
            $(this).parents('.conversion-type').toggleClass('open');
        });
    },
    initialize_data_and_dropdowns: function(entries){
        
        // console.log("entries:", entries);
        //calling initialize functions for objects
        Coins.initialize(entries);
        // DEBUGGIN ONLY
        // window.coins = Coins;
        var coins_list = Coins.get_filtered_list();
        
        Standards.initialize(coins_list);
        //         // DEBUGGIN ONLY
                // window.standards = Standards;
        Periods.initialize(coins_list);
            // DEBUGGIN ONLY
            // window.periods = Periods;
        Regions.initialize(coins_list);
            // DEBUGGIN ONLY
            // window.regions = Regions;

    }
}
$(document).ready(function() {
    App.initialize();
});