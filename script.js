var factorial_results = [];

function factorial(n) {
  if (n == 0 || n == 1)
    return 1;
  if (factorial_results[n] > 0)
    return factorial_results[n];
  return factorial_results[n] = factorial(n - 1) * n;
};

function targetPermutation(digits, target, working_cb) {
  var permutation = 1;
  var permuted = [];

  while (digits.length > 0) {
    var delta = target - permutation;
    var tail_length = digits.length - 1;
    var tail_permutations = factorial(tail_length);
    var selected_digit_index = Math.floor(delta / tail_permutations);
    permuted.push(digits.splice(selected_digit_index, 1)[0]);
  
    if(working_cb) working_cb([
      permutation,
      selected_digit_index,
      tail_length,
      digits,
      permuted]);

    permutation += selected_digit_index * tail_permutations;
  }

  return permuted;
};

function getDigits() {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9];
};

function calculatePermutation() {
  var target = parseInt($("#target_input").val());
  var inputOk = !isNaN(target) && target > 0 && target <= factorial(9);
  var permutedString = "input error";

  clearWorking();
  
  if (inputOk) {
    var permuted = targetPermutation(getDigits(), target, showWorking);
    permutedString = permuted.join('');
  }

  displayResult($("#target_input").val(), permutedString, "calculated", inputOk);
};

function clearWorking() {
  $("#working-content").empty();
  $("#working-content").prepend('<pre class="text-right text-muted">'
    + 'start with digits [' + getDigits().join(',') + ']</pre>');
};

var showWorking = function(args) {
  var permutation = args[0];
  var sdi = args[1];
  var tail_length = args[2];
  var tail_permutations = factorial(tail_length);
  var digits = args[3];
  var permuted = args[4];

  $("#working-content").prepend('<pre class="text-muted">'
    + 'from permutation number ' + permutation + ', '
    + '<br/>'
    + 'we promote the ' + (sdi + 1) + ordinal(sdi + 1)
    + ' digit from the sorted list of length ' + (tail_length + 1) + ','
    + '<br/>'
    + 'because the remaining list of length ' + tail_length
    + ' can be permuted in ' + tail_permutations + ' ways,'
    + '<br/>'
    + 'and promoting from the 1st up to the ' + sdi + ordinal(sdi) + ' digit adds '
    + sdi + ' * ' + tail_permutations + ' = ' + (sdi * tail_permutations)
    + ' permutations,'
    + '<br/>'
    + 'which takes us (just under target) to permutation number '
    + (permutation + sdi * tail_permutations) + ','
    + '</pre>');

  $("#working-content").prepend('<pre class="text-right text-muted">'
    + 'promote ' + (sdi + 1) + ordinal(sdi + 1) + ' digit -> '  
    + permuted.join('')
    + ' [' + digits.join(',') + ']'
    + '</pre>');
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
};

function addHistory(target, permutedString, action, success) {
  if (!$.trim($("#history-content").html())) {
    $("#history-header").append('<h2>history</h2>');
  }
  $("#history-content").prepend('<pre class="text-right small '
    + (success ? 'bg-success' : 'bg-danger') + '">'
    + action + " "
    + target + ordinal(target)
    + ' permutation is ' + permutedString
    + '</pre>');
};

function testCase(target, expectedString) {
  var permuted = targetPermutation(getDigits(), target);
  permutedString = permuted.join('');
  var pass = permutedString == expectedString;
  addHistory(target,
    permutedString + '<br/>vs expected ' + expectedString,
    "tested",
    pass); 
};

function test() {
  // First permutation
  testCase(1, "123456789");

  // Second permutation
  testCase(2, "123456798");

  // Third permutation
  testCase(3, "123456879");

  // 100000th permutation
  //testCase(100000, "358926471");
};