<script>
    export let showModal = false;
    export let isPromo = false;
</script>
{#if showModal}
    <div class="backdrop" class:promo={isPromo} on:click|self>
        <div class="modal">
            <h1>Click <u><a href="https://www.votetexas.gov/register/index.html" target="_blank">here</a></u> to begin your registration process</h1>
            <b>Are you eligible to vote?</b>
            <p>You are eligible if:
                <br>
                <br> • You are a United States citizen; <br>
                <br> • You are a resident of the county where you submit the application; <br>
                <br> • You are at least 17 years and 10 months old, and you are 18 years of age on
                Election Day. <br>
                <br> • You are not a convicted felon (you may be eligible to vote if you have completed your sentence, probation, and parole); and <br>
                <br> • You have not been declared by a court exercising probate jurisdiction to be either totally mentally incapacitated or partially mentally incapacitated without the right to vote.
            </p>
            <small>information from <a href="https://www.votetexas.gov/register/index.html">https://www.votetexas.gov/register/index.html</a>
            <br> Click anywhere in the background to exit.</small>
        </div>
    </div>
{/if}

<main>

</main>

<style>
.backdrop{
        width: 100%;
        height: 100%;
        position: fixed;
        background: rgba(0,0,0,0.8);
 }
.modal{
        padding: 10px;
        border-radius: 10px;
        max-width: 1000px;
        margin: 10%;
        text-align: center;
        background: white;
        z-index: 2;
    }
p{
    text-align: left;
    margin: 20px;
}
a{
    color: red;
}
b{
    color: #0024d6;
}

</style> 