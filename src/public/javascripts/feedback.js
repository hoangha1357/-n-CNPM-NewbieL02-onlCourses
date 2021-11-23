// $('textarea[required]').on('invalid', function() {
//     this.setCustomValidity($(this).data("required-message"));
// });
/* Set function for display              */
function displayNone() {
    document.querySelectorAll(".edit-feedback").forEach(a => a.style.display = "none");
}

function displayFlex() {
    document.querySelectorAll(".edit-feedback").forEach(a => a.style.display = "flex");
}
/* ------------------------------------ */

/* Set function for display              */

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {

    var anchorDelete = document.getElementsByClassName('delete-fb');
    for (var i = 0; i < anchorDelete.length; i++) {
        var anchor = anchorDelete[i];
        anchor.addEventListener('click', removeItemFB);
    }

    var anchorEdit = document.getElementsByClassName('edit-fb');
    for (var i = 0; i < anchorEdit.length; i++) {
        var anchor = anchorEdit[i];
        anchor.addEventListener('click', editFB);
    }


}


function removeItemFB(event) {
    var anchorClicked = event.target;
    var id = anchorClicked.parentElement.parentElement.getElementsByClassName('id')[0].value;
    var formDelete = document.getElementById('delete-feedback');
    formDelete.action = '/feedback/delete/' + id;
}


function editFB(event) {
    var anchorClicked = event.target;
    var comment = anchorClicked.parentElement.parentElement.parentElement.getElementsByClassName('comment-feedback')[0].getAttribute('data-value');
    var commentEdit = document.getElementById('comment-feedback-edit');
    var id = anchorClicked.parentElement.parentElement.getElementsByClassName('id')[0].value;
    var formEditFeedback = document.getElementById('form-edit-feedback');

    commentEdit.value = comment;
    formEditFeedback.action = '/feedback/update/' + id;
}
/* ------------------------------------ */