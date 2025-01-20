function handleEmailDomainChange() {
    const domainSelect = document.getElementById("email-domain");
    const domainInput = document.getElementById("email-domain-input");

    if (domainSelect.value === "type") {
        domainInput.value = "";
        domainInput.disabled = false;
    } else {
        domainInput.value = domainSelect.value;
        domainInput.disabled = false;
    }
}