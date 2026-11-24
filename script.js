document.querySelectorAll("[data-logo]").forEach(function(img){if(window.UNION_LOGO)img.src=window.UNION_LOGO});
document.querySelectorAll(".filter").forEach(function(button){button.addEventListener("click",function(){document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));button.classList.add("active");const cat=button.dataset.filter;document.querySelectorAll(".gallery article").forEach(card=>{card.hidden=cat!=="all"&&card.dataset.cat!==cat})})});
const form = document.querySelector("#quote-form");
if (form) {
  const status = document.querySelector("#form-status");
  const manual = document.querySelector("#manual-quote");
  const copyButton = document.querySelector("#copy-quote");

  function requestDetails() {
    const data = new FormData(form);
    const service = data.get("service");
    const recipient = service === "Permitting" ? "designs@unionsignco.com"
      : service === "New sign design / fabrication coordination" ? "designs@unionsignco.com"
      : "sales@unionsignco.com";
    const subject = "Website quote request: " + (data.get("company") || data.get("name"));
    const body = [["Name","name"],["Company","company"],["Phone","phone"],["Email","email"],
      ["Service address","address"],["Service","service"],["Project details","details"]]
      .map(([label, key]) => label + ": " + data.get(key)).join("\n");
    return { recipient, subject, body };
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const { recipient, subject, body } = requestDetails();
    status.textContent = "Send the draft from your email app and attach any photos there. If it didn’t open, use Copy Request.";
    window.location.href = "mailto:" + recipient + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  });

  copyButton.addEventListener("click", async function () {
    if (!form.reportValidity()) return;
    const { recipient, subject, body } = requestDetails();
    const request = "To: " + recipient + "\nSubject: " + subject + "\n\n" + body;
    try {
      await navigator.clipboard.writeText(request);
      manual.hidden = true;
      status.textContent = "Copied. Paste into a new email to " + recipient + " and attach any photos.";
    } catch {
      manual.value = request;
      manual.hidden = false;
      manual.focus();
      manual.select();
      status.textContent = "Copy the selected details into a new email to " + recipient + " and attach any photos.";
    }
  });

  form.style.removeProperty("display");
}
