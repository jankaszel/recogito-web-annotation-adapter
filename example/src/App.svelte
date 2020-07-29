<script>
    import Recogito from '@recogito/recogito-js'
    import { WebAnnotationAdapter } from '../../'
    import faust from '../faust.txt'

    let content, containerUrl, submitted, r, endpoint

    async function submit (event) {
        event.preventDefault()

        if (!containerUrl || submitted) {
            return
        }

        if (!containerUrl.endsWith('/')) {
            containerUrl = `${containerUrl}/`
        }

        const r = Recogito.init({ content })
        const targetSource = content.getAttribute('data-source')
        const adapter = new WebAnnotationAdapter(r, targetSource, containerUrl)
        adapter.getAnnotations()

        submitted = true
    }

    const verses = faust.split('\n\n').map(group => group.split('\n'))
</script>

<main>
    <header>
        <form on:submit={submit} disabled={submitted}>
            <div class="line">
                <label for="container-url" class="full">Annotation Container URL:</label>
                <input type="text" id="container-url" disabled={submitted} bind:value={containerUrl}/>
            </div>

            <button class="submit" disabled={!containerUrl || submitted}>Load Annotations</button>
        </form>
    </header>
    <div
            bind:this={content}
            class="chapter"
            class:disabled="{ submitted !== true }"
            id="faust"
            data-source="http://localhost:5000/#faust">
        {#each verses as group}
            <p class="group">
                {#each group as verse}
                    {verse}<br/>
                {/each}
            </p>
        {/each}
    </div>
</main>

<style>
    header {
        box-sizing: border-box;
        width: 100%;
        margin: 0;
        padding: 25px;

        background: rgb(245, 245, 245);
        font: 400 14px/100% Inter, sans-serif;
    }

    h1 {
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 4em;
        font-weight: 100;
    }

    .line {
        display: flex;
        flex-direction: column;
        margin-bottom: 10px
    }

    label {


    }

    label.full {
        margin-bottom: 5px;
    }

    input[type=text] {
        width: 450px;
        padding: 8px 12px;
        border: 1px solid rgb(200, 200, 200);
        border-radius: 3px;

        transition: border-color 125ms ease-in-out;
    }

    input[type=text]:focus, input[type=text]:active {
        border-color: rgb(150, 150, 245);
    }

    button.submit {
        padding: 8px 12px;
        border: 0 none;
        border-radius: 3px;
        color: white;
        background-color: rgb(50, 50, 50);

        cursor: pointer;
        transition: background-color 125ms ease-in-out, opacity 125ms ease-in-out;
    }

    button.submit[disabled] {
        opacity: 0.6;
        cursor: not-allowed;
    }

    button.submit:not([disabled]):hover {
        background-color: rgb(70, 70, 70);
    }

    .chapter {
        margin: 50px;
        font: 500 24px/150% 'EB Garamond', times, serif;
    }

    .chapter.disabled {
        opacity: 0.25;
        pointer-events: none;
    }

    p.group {
        margin-bottom: 30px;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>
