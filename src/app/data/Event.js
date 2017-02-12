function ludditeEvent() {
    return [
        "Luddite Movement gaining popularity",
        "Industrial output at risk. Hire 5 more staff within one month or risk reduced productivity.",
    ]
}

function disputeEvent() {
    return [
        "Dispute between " + a + " and " + b,
        "There has been a dispute at work between " + a + " and " + b + ". You must resolve this or face further unrest."
    ]
}

function moleEvent() {
    return [
        "Mole from rival company",
        "A supposed mole from a rivaly company is offering data that could advance your research. You do not know how reliable this person is."
        "Accept the deal", "Pay XXX", () => {
            alert("BADDIE!")
        }, "Reject", "", () => {

        }
    ]
}

function warEvent() {
    return [
        "Naopleonic Wars demand large industrial output.",
        "There will be increased investment in the military sector.",
        
    ]
}


function selectEvent() {
    // 1 in 50 chance of an event happening

}