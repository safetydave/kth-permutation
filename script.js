var f = [];

function factorial(n) {
  if (n == 0 || n == 1)
    return 1;
  if (f[n] > 0)
    return f[n];
  return f[n] = factorial(n - 1) * n;
};

function targetPermutation(digits, target) {
  var permutation = 1;
  var permuted = [];

  while (digits.length > 0) {
    //console.log("Figuring out the " + 9-digits.legth + ordinal(9-digits.length) + " digit");
    var delta = target - permutation;
    //console.log(delta + " permutations remaining to target");
    var tail_permutations = factorial(digits.length - 1);
    //console.log("tail permits " + tail_permutations + " permutations");
    var selected_digit_index = Math.floor(delta / tail_permutations);
    //console.log("therefore we need " + selected_digit_index + " to approach target and choose this item from tail");
    permuted.push(digits.splice(selected_digit_index, 1)[0]);
    permutation += selected_digit_index * tail_permutations;
    //console.log("We are now up to permutation number " + permutation);
  }

  return permuted;
}

function getDigits() {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9];
}

function calculatePermutation() {
  var target = parseInt($("#target_input").val());
  var inputOk = !isNaN(target) && target > 0 && target <= factorial(9);
  var permutedString = "input error";

  if (inputOk) {
    var permuted = targetPermutation(getDigits(), target);
    permutedString = permuted.join('');
  }

  displayResult($("#target_input").val(), permutedString, "calculated", inputOk);
};

function displayResult(target, permutedString, action, success) {
  $("#output").empty();
  $("#output").append('<h1 class="text-right '
    + (success ? 'bg-success' : 'bg-danger') + '">'
    + permutedString + '</h1>');

  addHistory(target, permutedString, action, success);
};

function ordinal(number) {
  if (number % 10 == 1) return "st";
  if (number % 10 == 2) return "nd";
  if (number % 10 == 3) return "rd";
  return "th"
}

function addHistory(target, permutedString, action, success) {
  if (!$.trim($("#history-data").html())) {
    $("#history-header").append('<h2>history</h2>');
  }
  $("#history-data").prepend('<p class="text-right '
    + (success ? 'bg-success' : 'bg-danger') + '">'
    + action + " "
    + target + ordinal(target)
    + ' permutation is ' + permutedString
    + '</p>');
};

function testCase(target, expectedString) {
  var permuted = targetPermutation(getDigits(), target);
  permutedString = permuted.join('');
  var pass = permutedString == expectedString;
  addHistory(target,
    permutedString + '<br/>vs ' + expectedString,
    "tested",
    pass); 
}

function test() {
  // First permutation
  testCase(1, "123456789");

  // Second permutation
  testCase(2, "123456798");

  // Third permutation
  testCase(3, "123456879");

  // 100000th permutation
  testCase(100000, "358926471");
};