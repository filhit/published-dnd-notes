// Put your computations here.

function userComputed(data) {
  result = {};
  if (data["previous-session"])
    result.previousSession = data["previous-session"]
  if (data["next-session"])
    result.nextSession = data["next-session"]
  return result;
}

exports.userComputed = userComputed;
