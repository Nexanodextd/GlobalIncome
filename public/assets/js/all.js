$(document).ready(function () {
    let paymentMethod = localStorage.getItem('paymentMethod');
    let depositAmount = localStorage.getItem('depositAmount');
    $('#money').text(`${depositAmount.toLocaleString()}`);
    $('#amount').text(`${depositAmount.toLocaleString()}`);
    $('#paymentMethod').text(`${paymentMethod}`);
    $('#inputPaymentMethod').val(paymentMethod)
    $('#walletcoin').text(paymentMethod);
    $('#payment-amount').val(depositAmount);

    $.ajax({
        url: "/api/getAdmin_walletAddress/" + paymentMethod,
        type: 'GET',
        success: function (res) {
            $('#walletAddress').val(res.data)

        },
        error: function (err) {
            console.log(err)
        }
    })


})

$("#copyWallet").click(function (e) {
    e.preventDefault();
    let wallet = $("#walletAddress");

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
    formdata.append('image', file);
    formdata.append('walletAddress', walletAddress);
    formdata.append('paymentAmount', payment_amount);
    formdata.append('paymentMethod', paymentMethod);
    formdata.append('depositType', depositType);
    formdata.append('userid', userid);
    if (!file) {
        alert("Please select a file first");
    } else {

        $.ajax({
            url: "trans_api/transaction",
            type: "POST",
            data: formdata,
            processData: false,
            contentType: false,
            success: function (res) {
                swal('Payment Made', 'Transaction on Pending', 'success');
                location.href = '/dashboard'
                console.log(res.data)

            },
            error: function (xhr, status, error) {
                alert("Error: " + error);
            }
        });

    }


})


let selectedCoin="";
let coin_price =0;
$('#coinSelect').on('change', function () {
     selectedCoin= $(this).val();
    if (!selectedCoin) {
        $('#coinPrice').text("0.00");
        $('#selectedCoin').text("----");

        return
    }
  
       getLivePrice();
    $('#selectedCoin').text(selectedCoin);
    
   

});
function getLivePrice() {
        
      if (!selectedCoin) {
        return;
    }
     
    $.ajax({

        url: `/api/crypto-price/${selectedCoin}`,

        type: "GET",

        success: function (response) {

            if (response.success) {
                coin_price=Number(response.price).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:8});
                $("#coinPrice").text(
                    Number(response.price).toLocaleString(
                        undefined,
                        {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 8
                        }
                    )
                );

            }

        },

        error: function (xhr) {

            console.log("Price error:", xhr.responseJSON);

        }

    });

}


// Get latest price every 1 second
setInterval(function () {

   getLivePrice();

}, 5000);

$('#BUY').on('click', function (e) {
    e.preventDefault();
    let amount = $('#amount').val();
    if (amount === '') {
       // $('#trade_smg').html(`<p class='alert alert-danger' style='color:white'>Please amount must be filled</p>`);
        swal(`amount must be filled`, '', 'error');
    } else {
        $.ajax({
            url: "/trade_api/buy",
            type: "POST",
            contentType: 'application/json',
            data: JSON.stringify({ selectedCoin, amount, coin_price }),
            success: function (res) {
                if(res.success==true){
                   // $('#successmsg').html(`<p class="alert alert-success" style="color:white; text-align:center">${res.message}</p>`)
                    swal(`${res.message}`, '', 'success');
                   /* setTimeout(function(){
                        $('#successmsg').fadeOut();
                    },3000)*/
                }
            },
            error: function (err) {
                $('#trade_msg').html(`<p class='alert alert-danger'>${err} </p>`)
                console.log(err)
            }

        })
    }
})

$('#SELL').on('click', function (e) {
    e.preventDefault();
    let quantity = $('#amount').val();
    if (quantity === '') {
       // $('#trade_smg').html(`<p class='alert alert-danger' style='color:white'>Please amount must be filled</p>`);
        swal(`amount must be filled`, '', 'error');
    } else {
        $.ajax({
            url: "/trade_api/sell",
            type: "POST",
            contentType: 'application/json',
            data: JSON.stringify({ selectedCoin, quantity, coin_price }),
            success: function (res) {
                if(res.success){
                  
                    swal(`${res.message}`, '', 'success');
                  
                }else{
                        swal(`${res.message}`, '', 'error');
                }
            },
            error: function (err) {
                $('#trade_msg').html(`<p class='alert alert-danger'>${err} </p>`)
                console.log(err)
            }

        })
    }
})
$('#updateUserProfile').on('submit',function(e){
     e.preventDefault();
     let dob = $('#date').val();
     let address =$('#address').val();
      if(dob=="" || address==""){
                 
                 swal(`All fields must be filled`, '', 'error');
      }else{
                 $.ajax({
                       url:"api/editProfile",
                       type:"POST",
                       contentType:"application/json",
                       data:JSON.stringify({dob,address}),
                       success:function(res){
                          if(res.success){
                                 swal(`${res.message}`, '', 'success');
                          }else{
                                   swal(`${res.message}`, '', 'error');
                          }

                       },
                       error:function(err){
                           console.log(err)
                       }
                 })
      }
})
