// Put your computations here.

function userComputed(data) {
  result = {};
  if (data["previous-session"])
    result.previousSession = data["previous-session"]
  if (data["next-session"])
    result.nextSession = data["next-session"]
  if (data["aliases"])
    result.aliases = data["aliases"]
  return result;
}

exports.userComputed = userComputed;
