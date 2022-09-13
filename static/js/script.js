function dictionaryListAjax(dic_controls) {
    $.ajax({
        url: '/ajax/dictionary-list',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(dic_controls),
        success: data => {
            let res_str = '';

            for (let i = 0; i < data.ditems_count; i++) {
                let regexp = new RegExp(`${dic_controls.search}`, 'ig');
                res_str += '<a class="dic-item" href="/dictionary/' + data.links[i] + '">';
                res_str += '<p class="ditem-title">' + data.titles[i].replace(regexp, '<span class="ditem-title-marked">$&</span>') + '</p>';
                if (data.types[i] != 'word')
                    res_str += '<p class="ditem-source">' + data.sources[i] + '</p>';
                res_str += '<p class="ditem-type"><span class="ditem-type-' + data.types[i] + '"></span> ';
                if (data.types[i] == 'idiom')
                    res_str += 'Идиома';
                else if (data.types[i] == 'word')
                    res_str += 'Неологизм';
                else
                    res_str += 'Каламбур';
                res_str += '</p></a>';
            }

            document.getElementById('dic-items-wrapper').innerHTML = res_str;
        }
    });
}

$(document).ready(() => {

    // MOVE UP
    if ($(window).scrollTop() >= 3000) {
        $('#move-up').show();
    }
    $(window).scroll(() => {
        if ($(this).scrollTop() >= 3000) {
            $('#move-up').fadeIn();
        } else {
            $('#move-up').fadeOut();
        }
    }); 
    $('#move-up').click(() => {
        $(window).scrollTop(0);
        $('#move-up').hide();
    });

    // DICTIONARY CONTROLS
    let dic_controls = {
        reversed_sort: false,
        search: '',
        sources_checked: [],
        types_checked: []
    }
    $('#dcontr-sort').click(() => {
        dic_controls.reversed_sort = !dic_controls.reversed_sort;
        $('#dcontr-sort-abc').toggle();
        $('#dcontr-sort-rev').toggle();

        dictionaryListAjax(dic_controls);
    });
    $('#dcontr-search').keyup(() => {
        dic_controls.search = $('#dcontr-search').val();

        dictionaryListAjax(dic_controls);
    });
    $('#dcontr-submit').click(() => {
        dic_controls.sources_checked = [];
        dic_controls.types_checked = [];

        let sourceBoxes = document.getElementsByClassName('source-checkbox');
        for (let i = 0; i < sourceBoxes.length; i++) {
            if (sourceBoxes[i].checked)
                dic_controls.sources_checked.push('"' + sourceBoxes[i].value + '"');
        }
        
        let typeBoxes = document.getElementsByClassName('type-checkbox');
        for (let i = 0; i < typeBoxes.length; i++) {
            if (typeBoxes[i].checked)
                dic_controls.types_checked.push("'" + typeBoxes[i].value + "'");
        }

        dictionaryListAjax(dic_controls);
    });
    $('#dcontr-toggle-optionals').click(() => {
        $('#dcontr-toggle-optionals .fa-arrow-up').toggle();
        $('#dcontr-toggle-optionals .fa-arrow-down').toggle();
        $('#dcontr-optionals').slideToggle();
    });
    
    // WORD PRONUNCIATION
    $('#dicart-ipa-button').click(() => {
        document.getElementById('pronunciation').play();
    });
});