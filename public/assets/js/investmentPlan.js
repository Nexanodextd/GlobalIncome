

$(document).on("input", ".investment-range", function () {

  const plan = $(this).closest(".investment-plan");

  // Get current value of the range
  const value = $(this).val();

  // Update the input immediately
  plan.find(".investment-input").val(
    Number(value).toLocaleString()
  );

});

$(".investment-plan").each(function () {

  const plan = $(this);

  const min = plan.data("min");
  const max = plan.data("max");
  const step = plan.data("step");

  plan.find(".investment-range").attr({
    min: min,
    max: max,
    step: step
  });

});

$(".investment-range").on("input", function () {
  $(this)
    .closest(".investment-plan")
    .find(".investment-input")
    .val(Number($(this).val()).toLocaleString());
});

$(document).ready(function () {

  $.ajax({
    url: "/api/getInvestmentPlan",
    type: "GET",
    success: function (response) {

      let investmentPlans = "";

      response.data.forEach(function (investPlans) {

        $(document).ready(function () {

          $.ajax({
            url: "/api/getInvestmentPlan",
            type: "GET",
            success: function (response) {

              let investmentPlans = "";

              response.data.forEach(function (investPlans) {
                investmentPlans += `<div class="col-lg-4 lg-bottom">

            <div class="investment-card">
              <div class='msg'></div>
              <form class="investmentForm" >
              <div class="roi-badge">

                <i class="bi bi-graph-up-arrow"></i>

                 ${investPlans.return_rate}% ROI

              </div>

              <div class="card-header-custom">

                <h2 class="plan-title">
                   <input type='hidden'  id='investmentName' value='${investPlans.investment_name}'>
                  ${investPlans.investment_name}
                </h2>

                <div class="line"></div>

                <div>

                  <span class="price">
                    $${investPlans.min_investment.toLocaleString()}
                  </span>

                  <span class="minimum">
                    minimum
                  </span>

                </div>

              </div>

              <div class="card-body-custom">

                <div class="feature">

                  <div class="feature-icon">
                    <i class="bi bi-check-lg"></i>
                  </div>

                  <div>
                    Min Investment: $<span id ='min'>${investPlans.min_investment.toLocaleString()}</span>
                  </div>

                </div>

                <div class="feature">

                  <div class="feature-icon">
                    <i class="bi bi-check-lg"></i>
                  </div>

                  <div>
                    Max Investment: $<span id='max'>${investPlans.max_investment.toLocaleString()}</span>
                  </div>

                </div>

                <div class="feature">

                  <div class="feature-icon">
                    <i class="bi bi-check-lg"></i>
                  </div>

                  <div>
                    Return Rate:
                    <span class="green-text">
                      ${investPlans.return_rate}% Every 10 Minutes
                    </span>
                  </div>



                </div>

                <div class="feature">

                  <div class="feature-icon">
                    <i class="bi bi-check-lg"></i>
                  </div>

                  <div>
                    Duration:<span id='duration'> ${investPlans.duration}</span>
                  </div>

                </div>

                <div class="input-label">
                  Investment Amount ($)
                </div>

                <div class="investment-plan"  data-min="${investPlans.min_investment}" data-max="${investPlans.max_investment}" data-step="1000">
                  <div class="input-wrapper">

                    <span class="dollar">$</span>

                    <input type="text" id="amount" class="form-control investment-input" placeholder="5000" />

                  </div>

                  <input type="range" class="form-range investment-range" min="${investPlans.min_investment}" max="${investPlans.max_investment}" value="5000" step="100" />
                </div>

                <div class="min-max">

                  <span>Min: $${investPlans.min_investment.toLocaleString()}</span>

                  <span>Max: $${investPlans.max_investment.toLocaleString()}</span>

                </div>

                <div class="return-text">

                  Potential Return:
                  <span class="green-text">
                    $${investPlans.potential_return.toLocaleString()}
                  </span>

                  Every 10 Minutes

                </div>


                <button type='submit' class="join-btn" id="joinInvestment">

                  <i class="bi bi-lock-fill"></i>

                  Join Investment Plan

                </button>

              </div>
               </form>
            </div>

          </div>`
              });
              $('#displayPlans').html(investmentPlans)

            },
            error: function (error) {
              console.log(error)
            }
          })


        })

      });
      $('#displayPlans').html(investmentPlans)

    },
    error: function (error) {
      console.log(error)
    }
  })


})

$(document).on('submit', '.investmentForm', function (e) {
  e.preventDefault();
  let form = $(this)

  let investName = form.find('#investmentName').val();
  let amount = Number(form.find('#amount').val());
  let duration = form.find('#duration').text().trim();
  let minInvest = Number(form.find('#min').text().replace(/,/g, ""));
  let maxInvest = Number(form.find('#max').text().replace(/,/g, ""));

  if (amount == "") {
     swal('please fill in the amount field', '', 'warning');
  } else if (amount < minInvest) {
    swal(`min amount should be:   $${minInvest.toLocaleString()}`, '', 'warning');
  } else if (amount > maxInvest) {
    // sweet alert
     swal(`max amount should be:   $${maxInvest.toLocaleString()}`, '', 'warning');
  }
  else {
    $.ajax({
      url: "/api/investments",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ investName, amount, duration }),
      success: function (res) {
        if (res.success == true) {
          console.log(res.data.amount + "" + res.message)
            swal(`${res.data.amount+" "+res.message}`, '', 'success');

        } else if (res.success == false) {
          console.log(res.message);
            swal(`${res.message}`, '', 'error');
        }
      },
      error: function (error) {
        console.log(error)
       swal(`${error}`, '', 'error');

      }
    })
  }

})