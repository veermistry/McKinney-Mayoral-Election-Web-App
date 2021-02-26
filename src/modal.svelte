<script>
    export let showModal = false;
    export let isPromo = false;
</script>
{#if showModal}
    <div class="backdrop" class:promo={isPromo} on:click|self>
        <div class="modal">
            <p>example text</p>
        </div>
    </div>
{/if}

<main>

</main>

<style>
.modal{
        padding: 10px;
        border-radius: 10px;
        max-width: 400px;
        margin: 10%;
        text-align: center;
        background: white;
    }

</style> 