$(document).ready(function () {
    let paymentMethod = localStorage.getItem('paymentMethod');
    let depositAmount = localStorage.getItem('depositAmount');
    $('#money').text(`${depositAmount.toLocaleString()}`);
    $('#amount').text(`${depositAmount.toLocaleString()}`);
    $('#paymentMethod').text(`${paymentMethod}`);
    $('#inputPaymentMethod').val(paymentMethod)
    $('#payment-amount').val(depositAmount);
    

})
$("#copyWallet").click(function () {

    let wallet =
        $("#walletAddress");

    wallet.select();

    navigator.clipboard.writeText(
        wallet.val()
    );

    $(this).html(`
        <i class="bi bi-check-lg"></i>
        Copied
      `);

    setTimeout(() => {

        $(this).html(`
            <i class="bi bi-copy"></i>
            Copy
          `);

    }, 2000);

});

$('#payment-form').on('submit', function (e) {

    e.preventDefault();
    const payment_amount = $('#payment-amount').val();
    const walletAddress = $('#walletAddress').val();
    const paymentMethod = $('#inputPaymentMethod').val();
    const depositType = $('#type').val();
     const userid = $('#userid').val();
    const fileInput = $('#fileupload')[0];
    const file = fileInput.files[0];
    const formdata = new FormData();
    formdata.append('image',file);
    formdata.append('walletAddress',walletAddress);
    formdata.append('paymentAmount',payment_amount);
    formdata.append('paymentMethod',paymentMethod);
    formdata.append('depositType',depositType);
    formdata.append('userid',userid);
    if (!file) {
        alert("Please select a file first");
    } else {

        $.ajax({
            url: "trans_api/transaction",
            type: "POST",
             data: formdata,
            processData:false,
            contentType: false,
            success: function (res) {
                 swal('Payment Made', 'Transaction on Pending', 'success');
                 location.href='/dashboard'
                console.log(res.data)
               
            },
            error: function(xhr, status, error) {
                        alert("Error: " + error);
                    }
        });

    }


})