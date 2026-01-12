$ = jQuery;

function animateCSS(element, animationName, callback) {
	var node = document.querySelector(element);
	node.classList.add('animated', animationName);

	function handleAnimationEnd() {
		node.classList.remove('animated', animationName);
		node.removeEventListener('animationend', handleAnimationEnd);

		if (typeof callback === 'function') callback();
	}

	node.addEventListener('animationend', handleAnimationEnd);
}

function isValidEmailAddress(emailAddress) {
	var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
	return pattern.test(emailAddress);
};

function isValidPartyZip(partyZip) {
	var zipPattern = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
	return zipPattern.test(partyZip);
};

$('#bookedDate').datepicker({
	language: 'en',
	inline: true,
	minDate: new Date(),
	maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
	keyboardNav: false,
	onSelect: function (formattedDate, date, inst) {
		$("#nextStep").click();
	}
})
$('#calendarDiv').datepicker({
	language: 'en',
	inline: true, // This will display the calendar inline within the div
	minDate: new Date(),
	maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
	keyboardNav: false,
	onSelect: function (formattedDate, date, inst) {
		// When a date is selected, update the hidden input field
		$('#bookedDate').val(formattedDate);

		// Trigger the next step (if you need to move to the next step)
		$("#nextStep").click();
	}
});
$('.arrivalTime').change(function () {
	$("#nextStep").click();
});

function select2CopyClasses(data, container) {
	if (data.element) {
		$(container).attr('data-search', $(data.element).attr("data-search")); // Add character tags attribute to select2 choices
		$(container).attr('data-image-src', $(data.element).attr("data-image-src")); // Add image link attribute to select2 choices
	}
	return data.text;
}

function matchCustom(params, data) {
	// Case sensitive fix
	var checkText = (data.text || '').toUpperCase()
	var checkTerm = (params.term || '').toUpperCase()
	var dataElement = $(data.element).data('search').toString().toUpperCase()

	// If there are no search terms, return all of the data
	if ($.trim(checkTerm) === '') {
		return data;
	}

	// Do not display the item if there is no 'text' property
	if (typeof checkText === 'undefined') {
		return null;
	}

	// Check if the data occurs
	if (dataElement.indexOf(checkTerm) > -1) {
		return data;
	}

	// Return `null` if the term should not be displayed
	return null;
}
var characterListParent = $(".characterList").parent();
$('.characterList').select2({
	placeholder: 'Search Characters',
	width: '100%',
	closeOnSelect: false,
	scrollAfterSelect: true,
	templateResult: select2CopyClasses,
	templateSelection: select2CopyClasses,
	matcher: matchCustom,
	dropdownParent: characterListParent
});

////////////////heree is the change ////////////////////////
var characterListParent = $(".characterList_new").parent();
$('.characterList_new').select2({
	placeholder: 'Search Characters',
	width: '100%',
	closeOnSelect: false,
	scrollAfterSelect: true,
	templateResult: select2CopyClasses,
	templateSelection: select2CopyClasses,
	matcher: matchCustom,
	dropdownParent: characterListParent,
	tags: true,  // Enable tagging (allow users to type custom values)
	createTag: function (params) {
		return {
			id: params.term,
			text: params.term
		};
	}
});
let searchFieldValue = ''; // Store the search input value
var typedValue = '';
/**new book now module js start */

$('#bookedCharacters_new').on('select2:open', function () {
	const searchField = $('.select2-container--open .select2-search__field');
	console.log("Dropdown opened");
	typedValue = $(this).next('.select2').find('.select2-search__field').val();
	// Capture the value when the dropdown is open and input loses focus
	searchField.on('blur', function () {
		console.log(`Focus lost. Current value: ${$(this).val()}`);
	});
});

$('#bookedCharacters_new').on('select2:close', function () {
	var selectedValue = $(this).val();
	if (selectedValue == '') {
		var options = $(this).find('option');
		var lastOption = options.last().val();
		$(this).val(lastOption).trigger('change');
		// return;
	}

});
//////////////////////////////////////book now new js end////////////////////////////////////////
// Character Image Preview START
$(document).on({
	mouseenter: function () {
		$('html.no-touch body').append('<div class="character-preview"><img src="' + $(this).attr('data-image-src') + '" /></div>');
	},
	mousemove: function (e) {
		$('.character-preview').css({
			left: e.pageX + 50,
			top: e.pageY - 85
		});
	},
	mouseleave: function () {
		$('.character-preview').remove();
	}
}, '.bookingCharacters .select2-results__option');
// Character Image Preview END

var locationParent = $("#bookedLocation").parent();
$('#bookedLocation').select2({
	placeholder: 'Select a Location',
	width: '100%',
	dropdownParent: locationParent
});

$(document).ready(function () {
	$(".importantField label").html('Email - Do not fill this field');
	$(".importantField input").attr('tabindex', '-1');
	$(".importantField").css({ 'position': 'absolute', 'top': '-99999px', 'left': '-99999px' });
	$(".importantField").hide();

	$("#nextStep").click(function () {
		$(this).addClass('stepDisabled');

		if ($('.bookingStep.bookingCalendar.activeStep').length != 0 && $('.bookingStep.bookingCalendar.activeStep input').val() === '') {
			$('.bookingError').html("Please select an event date.").fadeIn();
			setTimeout(function () {
				$('.bookingError').fadeOut("slow");
			}, 5000);

			$(this).removeClass('stepDisabled');
			return false;
		}

		if ($('.bookingStep.bookingTimes.activeStep').length != 0 && !$('.bookingStep.bookingTimes.activeStep input:checked').val()) {
			$('.bookingError').html("Please select an arrival time for your event.").fadeIn();
			setTimeout(function () {
				$('.bookingError').fadeOut("slow");
			}, 5000);

			$(this).removeClass('stepDisabled');
			return false;
		}

		if ($('.bookingStep.bookingCharacters.activeStep').length != 0 && $('.bookingStep.bookingCharacters.activeStep input').val() === '' && $('#bookedCharacters').val() == null) {
			$('.bookingError').html("Please select at least one character.").fadeIn();
			setTimeout(function () {
				$('.bookingError').fadeOut("slow");
			}, 5000);

			$(this).removeClass('stepDisabled');
			return false;
		}
		if ($('.bookingStep.bookingCharacters.activeStep').length !== 0) {
			const characterInput = $('.bookingStep.bookingCharacters.activeStep input').val();
			const selectedCharacters = $('#bookedCharacters').val();

			if (characterInput === '' && (selectedCharacters === null || selectedCharacters.length === 0)) {
				$('.bookingError').html("Please select at least one character.").fadeIn();
				setTimeout(function () {
					$('.bookingError').fadeOut("slow");
				}, 5000);

				$(this).removeClass('stepDisabled');
				return false;
			}
		}
		///////////////////////////////////////validation for new /////////////////////////////
		if ($('.bookingStep.bookingCharacters_new.activeStep').length != 0 && $('.bookingStep.bookingCharacters_new.activeStep input').val() === '' && $('#bookedCharacters_new').val() == null) {
			$('.bookingError').html("Please select at least one character.").fadeIn();
			setTimeout(function () {
				$('.bookingError').fadeOut("slow");
			}, 5000);

			$(this).removeClass('stepDisabled');
			return false;
		}
		if ($('.bookingStep.bookingCharacters_new.activeStep').length !== 0) {
			const characterInput = $('.bookingStep.bookingCharacters_new.activeStep input').val();
			const selectedCharacters = $('#bookedCharacters_new').val();


			if (characterInput === '' && (selectedCharacters === null || selectedCharacters.length === 0)) {
				$('.bookingError').html("Please select at least one character.").fadeIn();
				setTimeout(function () {
					$('.bookingError').fadeOut("slow");
				}, 5000);

				$(this).removeClass('stepDisabled');
				return false;
			}
		}
		animateCSS('.bookingStep.activeStep', 'fadeOutUp', function () {
			$(".bookingStep.activeStep").nextAll('.bookingStep').first().addClass('activeStep').prevAll('.bookingStep').first().removeClass('activeStep');
			animateCSS('.bookingStep.activeStep', 'fadeInUp');
			$("#nextStep").removeClass('stepDisabled');
		});

		$('.bookingError').hide();

		if ($(".bookingStep.activeStep").nextAll('.bookingStep').first().nextAll('.bookingStep').first().length != 0) {
			$('#nextStep').show();
			$('#prevStep').show();
		} else {
			$('#nextStep').hide();
			$('#prevStep').show();
			$('#submitForm').show();
		}
		return false;
	});

	$("#prevStep").click(function () {
		$(this).addClass('stepDisabled');

		animateCSS('.bookingStep.activeStep', 'fadeOutUp', function () {
			$(".bookingStep.activeStep").prevAll('.bookingStep').first().addClass('activeStep').nextAll('.bookingStep').first().removeClass('activeStep');
			animateCSS('.bookingStep.activeStep', 'fadeInUp');
			$("#prevStep").removeClass('stepDisabled');
		});

		if ($(".bookingStep.activeStep").prevAll('.bookingStep').first().prevAll('.bookingStep').first().length != 0) {
			$('#prevStep').show();
			$('#nextStep').show();
			$('#submitForm').hide();
		} else {
			$('#prevStep').hide();
			$('#nextStep').show();
			$('#submitForm').hide();
		}
		return false;
	});

	$('#submitForm').click(function () {
		$("#bookingSubmit").click();
	});
	$('.submit_new_form').click(function () {
		$("#bookingSubmit_new").click();
	});

	$('.extraCharactersButton').click(function () {
		$(".extraCharactersWrapper").show();
		$(this).hide();
	});

	$('#bookingSubmit').on("click", function () {
		var firstName = $('#firstName');
		var lastName = $('#lastName');
		var emailAddress = $('#emailAddress');
		var phoneNumber = $('#phoneNumber');
		var partyAddress = $('#partyAddress');
		var partyZip = $('#partyZip');
		var bookedLocation = $('#bookedLocation');
		var bookedLocationSelect2 = $('#bookedLocation + .select2 .select2-selection--single');
		// var username = $('#username'); // Used as Captcha to trick bots	
		var pppDo = $('#pppDo'); // Used as Captcha to trick bots
		var reCaptcha = grecaptcha.getResponse();

		var invalidForm = false;
		var invalidEmail = false;
		var invalidZip = false;
		var invalidCaptcha = false;
		$('#submitForm').removeClass('stepDisabled');
		$('#submitForm').text('Request Booking');
		if ($.trim(firstName.val()) == '') {
			firstName.css('border-color', 'red');
			invalidForm = true;
		}

		if ($.trim(lastName.val()) == '') {
			lastName.css('border-color', 'red');
			invalidForm = true;
		}

		if ($.trim(emailAddress.val()) == '') {
			emailAddress.css('border-color', 'red');
			invalidForm = true;
		}

		if ($.trim(emailAddress.val()) != '' && !isValidEmailAddress(emailAddress.val())) {
			emailAddress.css('border-color', 'red');
			invalidEmail = true;
		}

		if ($.trim(phoneNumber.val()) == '') {
			phoneNumber.css('border-color', 'red');
			invalidForm = true;
		}

		if ($.trim(partyAddress.val()) == '') {
			partyAddress.css('border-color', 'red');
			invalidForm = true;
		}

		if ($.trim(partyZip.val()) == '') {
			partyZip.css('border-color', 'red');
			invalidForm = true;
		}

		if ($.trim(partyZip.val()) != '' && !isValidPartyZip(partyZip.val())) {
			partyZip.css('border-color', 'red');
			invalidZip = true;
		}

		//disable validation for booking location by GS
		/**if(bookedLocation.length != 0 && bookedLocation.val() == '') {
			bookedLocationSelect2.css('border-color', 'red');
			invalidForm = true;
		}*/

		// if($.trim(username.val()) != ''){	
		// 	invalidCaptcha = true;	
		// }

		if ($.trim(pppDo.val()) != '') {
			invalidForm = true;
		}

		if (reCaptcha.length == 0) {
			invalidCaptcha = true;
		}

		setTimeout(function () {
			$('input').removeAttr('style');
			$('select').removeAttr('style');
			$('textarea').removeAttr('style');
			bookedLocationSelect2.removeAttr('style');
			$('.bookingError').fadeOut("slow");
		}, 5000);

		if (invalidForm) {
			$('.bookingError').html("Please fill the highlighted fields.").fadeIn();
			return false;
		} else if (invalidEmail) {
			$('.bookingError').html("Please enter a valid Email Address.").fadeIn();
			return false;
		} else if (invalidZip) {
			$('.bookingError').html("Please enter a valid Zip Code.").fadeIn();
			return false;
		} else if (invalidCaptcha) {
			$('.bookingError').html("Please click on Captcha.").fadeIn();
			return false;
		} else {
			$('#submitForm').text('Processing...');
			$('#submitForm').addClass('stepDisabled');
			return true;
		}
	});

	$('.pppBookNowModal').on("click", function (e) {
		event.preventDefault();
		$('.pppBookModal').css("display", "flex")
		$('.pppBookModal').hide()
		$('.pppBookModal').fadeIn();
		fbq('trackCustom', 'Book Now');
	});

	$('.pppModalClose').on("click", function () {
		$(this).parent().parent().fadeOut();
	});

	setTimeout(function () {
		$('.characterPopUpCTA').removeClass('hideP');
		animateCSS('.characterPopUpCTA', 'fadeInUp');
	}, 2500);

	$(".characterPopUpClose").click(function () {
		$('.characterPopUpCTA').fadeOut();
	});
});

$(document).keyup(function (e) {
	if (e.key === "Escape") { // escape key maps to keycode `27`
		$('.pppModalClose').click();
	}
});
/////////////////addnew form submission////////////////////////////

jQuery("#bookingSubmit_new").on('click', function (e) {
	e.preventDefault();
	var firstName = $('#firstName');
	var lastName = $('#lastName');
	var emailAddress = $('#emailAddress');
	var phoneNumber = $('#phoneNumber');
	var partyAddress = $('#partyAddress');
	var partyZip = $('#options');
	var bookedLocation = $('#bookedLocation');
	var bookedLocationSelect2 = $('#bookedLocation + .select2 .select2-selection--single');
	var pppDo = $('#pppDo');
	// var reCaptcha = grecaptcha.getResponse();

	var invalidForm = false;
	var invalidEmail = false;
	var invalidPhone = false;  // Ensure this is declared
	var invalidZip = false;
	var invalidCaptcha = false;  // Ensure this is declared

	$('#submitForm').removeClass('stepDisabled');
	$('#submitForm').text('Request Booking');

	// Clear any existing error messages
	$('.error-message').remove();

	// Validate First Name
	if ($.trim(firstName.val()) == '') {
		firstName.css('border-color', 'red');
		showError(firstName, "First Name is required.");
		invalidForm = true;
	} else {
		// Remove the red border if valid
		firstName.css('border-color', '');
		firstName.next('.error-message').remove();
	}

	// Validate Last Name
	if ($.trim(lastName.val()) == '') {
		lastName.css('border-color', 'red');
		showError(lastName, "Last Name is required.");
		invalidForm = true;
	} else {
		// Remove the red border if valid
		lastName.css('border-color', '');
		lastName.next('.error-message').remove(); // Remove error message if input is valid
	}

	// Validate Email Address
	if ($.trim(emailAddress.val()) == '') {
		emailAddress.css('border-color', 'red');
		showError(emailAddress, "Email Address is required.");
		invalidForm = true;
	} else if (!isValidEmailAddress(emailAddress.val())) {
		emailAddress.css('border-color', 'red');
		showError(emailAddress, "Please enter a valid Email Address.");
		invalidEmail = true;
	} else {
		// Remove the red border if valid
		emailAddress.css('border-color', '');
		emailAddress.next('.error-message').remove(); // Remove error message if input is valid
	}

	// Validate Phone Number
	if ($.trim(phoneNumber.val()) == '') {
		phoneNumber.css('border-color', 'red');
		showError(phoneNumber, "Phone Number is required.");
		invalidPhone = true;
	} else {
		// Remove the red border if valid
		phoneNumber.css('border-color', '');
		phoneNumber.next('.error-message').remove(); // Remove error message if input is valid
	}

	// Validate Party Address
	if ($.trim(partyAddress.val()) == '') {
		partyAddress.css('border-color', 'red');
		showError(partyAddress, "Party Address is required.");
		invalidForm = true;
	} else {
		// Remove the red border if valid
		partyAddress.css('border-color', '');
		partyAddress.next('.error-message').remove(); // Remove error message if input is valid
	}

	// Validate Party ZIP Code
	if ($.trim(partyZip.val()) == '') {
		partyZip.css('border-color', 'red');
		showError(partyZip, "ZIP Code is required.");
		invalidForm = true;
	} else if (!isValidPartyZip(partyZip.val())) {
		partyZip.css('border-color', 'red');
		showError(partyZip, "Please enter a valid ZIP Code.");
		invalidZip = true;
	} else {
		// Remove the red border if valid
		partyZip.css('border-color', '');
		partyZip.next('.error-message').remove(); // Remove error message if input is valid
	}

	// Validate Captcha (if necessary)
	if ($.trim(pppDo.val()) != '') {
		invalidForm = true;
	}

	// Show error message if any validation fails
	if (invalidForm) {
		showErrorMessage("Please fill the highlighted fields.");
		return false;
	} else if (invalidEmail) {
		showErrorMessage("Please enter a valid Email Address.");
		return false;
	} else if (invalidPhone) {
		showErrorMessage("Please enter a valid phone number.");
		return false;
	} else if (invalidZip) {
		showErrorMessage("Please enter a valid ZIP Code.");
		return false;
	} else if (invalidCaptcha) {
		showErrorMessage("Please click on Captcha.");
		return false;
	} else {
		$('#submitForm').text('Processing...');
		$('#submitForm').addClass('stepDisabled');
		// Submit the form if all required fields are valid
		jQuery("#bookingForm").submit();
		return true;
	}
	// Utility function to show error message below input
	function showError(inputElement, message) {
		var error = $('<span class="error-message" style="color:red; font-size: 12px;">' + message + '</span>');
		inputElement.after(error); // Append error message after the input element
	}

	// Function to show general error message
	function showErrorMessage(message) {
		$('.bookingError').html(message).fadeIn();
		setTimeout(function () {
			$('.bookingError').fadeOut("slow");
		}, 5000);
	}
})