$(document).ready(function () {

    // Function to display selected image
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#selected_image')
                    .attr('src', e.target.result)
                    .width(176)
                    .height(176);
            };

            reader.readAsDataURL(input.files[0]);
        }
    }

    // Trigger image selection event when the label is clicked
    $('.middle').click(function () {
        $('#imagefile').click();
    });

    // Trigger image selection event when the file input changes
    $('#imagefile').change(function () {
        readURL(this);
    });

    // Form submission handler
    $("form#analysis-form").submit(function (event) {
        event.preventDefault();

        var analyze_button = $("button#analyze-button");
        var imagefile = $('#imagefile')[0].files;

        // Check if an image is selected
        if (!imagefile.length > 0) {
            alert("Please select a file to analyze!");
        } else {
            analyze_button.html("Analyzing..");
            analyze_button.prop("disabled", true);

            var fd = new FormData();
            fd.append('file', imagefile[0]);

            // Send AJAX request to analyze the image
            $.ajax({
                method: 'POST',
                url: '/predict', // Assuming the endpoint is '/predict'
                data: fd,
                processData: false,
                contentType: false,
            }).done(function (data) {
                console.log("Done Request!");
                $("#result").html("Prediction: " + data.prediction);
            }).fail(function (e) {
                console.log("Fail Request!");
                console.log(e);
                alert("Error occurred during prediction.");
            }).always(function () {
                // Reset button state after analysis
                analyze_button.prop("disabled", false);
                analyze_button.html("Analyze");
            });
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    let currentSlide = 1;
    const totalSlides = document.querySelectorAll('.slide').length;

    function showSlide(n) {
        document.querySelectorAll('.slide').forEach(function(slide) {
            slide.classList.remove('active');
        });
        document.getElementById('slide' + n).classList.add('active');
    }

    function nextSlide() {
        currentSlide++;
        if (currentSlide > totalSlides) {
            currentSlide = 1;
        }
        showSlide(currentSlide);
    }

    // Change slide every 5 seconds (adjust as needed)
    setInterval(nextSlide, 5000);

    // Show the initial slide
    showSlide(currentSlide);
});

