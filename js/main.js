document.getElementById('current-year').textContent = new Date().getFullYear();

document.querySelectorAll('.disorder-card').forEach(card => {
    card.addEventListener('click', function(e) {
        if (!document.getElementById('disclaimer-check').checked) {
            e.preventDefault();
            alert('Please acknowledge the disclaimer before proceeding');
        }
    });
});