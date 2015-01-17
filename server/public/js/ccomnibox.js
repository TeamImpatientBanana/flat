/* This bit of javascript controls the ccomnibar
   so that it is always the correct width
   no matter what your screen width is.

   Note that it assumes:

   - a min body width of 400px
   - the logo on the left is there and unchanged
   - the dropdown button is on the right and unchanged
---------------------------------------------------------- */

var documentWidth = $( window ).width();
documentWidth = documentWidth - 295;
if (documentWidth > 120 ) {
    $( "#ccomnibar" ).width(documentWidth);
}
else {
    $( "#ccomnibar" ).width(120);
}

$( window ).resize(function() {
    documentWidth = $( window ).width();
    documentWidth = documentWidth - 310;
    if (documentWidth > 120 ) {
        $( "#ccomnibar" ).width(documentWidth);
    }
    else {
        $( "#ccomnibar" ).width(120);
    }
});