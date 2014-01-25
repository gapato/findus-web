document.payments = [];
var next_pid = 0;

function commit() {
    p = get_form_data();
    if (!p) { return; }
    p.id = next_pid++;

    document.payments.push(p);
    table_insert(p);

    $("#creditor").blur();
    $("#amount").blur();
    $("#debtors").blur();
    $("#comment").blur();

    data = JSON.stringify(document.payments);
    $('#json').html(data);
    clear_form();
    $('#togglejson').show();
    $('#reduce').show();
}

function findus_create() {
    data = JSON.stringify(document.payments);
    $('#json').html(data);
    btn = $('#create');
    btn.val("loading...").prop('disabled', true);
    setTimeout(function() {
        btn.val("ERROR").prop('disabled', false);
        setTimeout(function() {
            btn.val("Save to server");
        }, 5000);
    }, 5000);
    $.post("/create", {p:data}, function(data) {
        if (data != '') {
            window.location = data;
        }
    });
}

function findus_save(id) {
    data = JSON.stringify(document.payments);
    $('#json').html(data);
    btn = $('#save');
    btn.val("loading...").prop('disabled', true);
    setTimeout(function() {
        btn.val("ERROR").prop('disabled', false);
        setTimeout(function() {
            btn.val("Save to server");
        }, 5000);
    }, 5000);
    $.post("/"+id+"/save", {p:data}, function() {
        btn.val("Done !").prop('disabled', false);
        setTimeout(function(){btn.val('Save to server');}, 5000);
    });
}

function findus_delete(id) {
    data = JSON.stringify(document.payments);
    $('#json').html(data);
    btn = $("#delete");
    btn.val("loading...").prop('disabled', true);
    setTimeout(function() {
        btn.val("ERROR").prop('disabled', false);
        setTimeout(function() {
            btn.val("Delete");
        }, 5000);
    }, 5000);
    $.post("/"+id+"/delete", {p:data}, function(data) {
        if (data != '') {
            window.location = data;
        }
    });
}

function edit_payment() {
    id = this.parentElement.parentElement.id;
    num_id = id.split('_')[1];
    p = find_payment(num_id);
    $("#creditor").val(p.creditor);
    $("#amount").val(p.amount);
    $("#debtors").val(p.debtors);
    $("#comment").val(p.comment);
    $("#add").val("Update");
    remove_payment(id);
}

function remove_payment(id) {
    if (typeof(id) === 'undefined') {
        id = this.parentElement.parentElement.id;
    }
    $("#"+id).remove();
    num_id = id.split('_')[1];
    var i=0;
    while(item = document.payments[i]) {
        if (item.id == num_id) { break; }
        i++;
    }
    if (i < document.payments.length) {
        document.payments.splice(i, 1);
    }
    data = JSON.stringify(document.payments);
    $('#json').html(data);
}

function reduce() {
    data = JSON.stringify(document.payments);
    $('#json').html(data);
    $("#reduce").val("loading...").prop('disabled', true);
    $("#result").load("/reduce", {p:data}, function() {
        document.getElementById("result").scrollIntoView(true);
        $("#reduce").val("Reduce").prop('disabled', false);
    });
}

function find_payment(id) {
    var i = 0;
    while(item = document.payments[i]) {
        if (item.id == id) {
            return document.payments[i];
        }
        i++;
    }
    return null;
}

function table_insert(p) {
    p_div = document.createElement("div");
    p_div.className = "payment";
    p_div.id = "payment_" + p.id;

    info_col = document.createElement("div")
    info_col.className = "infocol";
    links_col = document.createElement("div");
    links_col.className = "linkscol";

    first_row = document.createElement("div");
    second_row = document.createElement("div");
    txt = p.creditor.italics()+ " paid " + (String(p.amount).italics() +'€').italics();
    if (p.comment.length > 0) {
        txt += ' ' + ('(' + p.comment + ')').italics();
    }
    txt += " for";
    first_row.innerHTML = txt;
    second_row.innerHTML = p.debtors.join(", ").italics();

    edit_link = document.createElement("input");
    edit_link.addEventListener("click", edit_payment);
    edit_link.value = "edit";
    edit_link.type = "button";
    edit_link.className = "block";

    remove_link = document.createElement("input");
    remove_link.addEventListener("click", remove_payment);
    remove_link.value = "×";
    remove_link.type = "button";
    remove_link.className = "block red";

    autonames_opt = document.createElement('option');
    autonames_opt.value = p.creditor;
    document.getElementById('autonames').appendChild(autonames_opt);

    links_col.appendChild(edit_link);
    links_col.appendChild(remove_link);
    info_col.appendChild(first_row);
    info_col.appendChild(second_row);
    p_div.appendChild(info_col);
    p_div.appendChild(links_col);
    $("#payments").append(p_div);
}

function clear_form() {
    $("#creditor").val("");
    $("#amount").val("");
    $("#debtors").val("");
    $("#comment").val("");
    $("#add").val("Add");
}

function get_form_data() {
    p = {
        creditor : "",
        amount   : 0,
        debtors  : [],
        comment  : ""
    };
    p.creditor = $("#creditor").val().trim();
    p.amount = parseFloat($("#amount").val());
    p.debtors = $("#debtors").val();
    p.debtors = p.debtors.split(",").map(function(i){return i.trim()}).filter(
                    function(i) { return i.length > 0; }
                );
    p.comment = $("#comment").val().trim();
    if (p.creditor === '' || isNaN(p.amount) || p.debtors.length === 0) {
        return null;
    }
    return p;
}

$(window).load(function() {
    if (typeof(saved_payments) !== 'undefined') {
        document.payments = saved_payments;
    }
    for (p in document.payments) {
        table_insert(document.payments[p]);
        next_pid++;
    }
});
