$(function () {



    let links = localStorage.getItem('links') ? JSON.parse(localStorage.getItem('links')) : []
    links.map((item) => {
        $('.link-list').append(makeLinkTemplate(item.url, item.hashid))
    })
    let linkText = null


    // handle submit
    $('#form-container form').on('submit', function (e) {
        e.originalEvent.preventDefault()
        if ($('#link').val() === '') {
            $(this).addClass('error')
            setTimeout(() => {
                $(this).removeClass('error')
            }, 3000);
            return false;
        }
        $.ajax({
            url: 'https://rel.ink/api/links/',
            method: 'POST',
            data: { 'url': $('#link').val() },
            success: function (res) {
                if (links.length === 0 || links.every((item) => item.hashid !== res.hashid)) {
                    $('.link-list').append(makeLinkTemplate($('#link').val(), res.hashid))

                    $('.link-list article button').off('click', handleCopyLink)
                    $('.link-list article button').on('click', handleCopyLink)

                    links = [
                        ...links,
                        {
                            hashid: res.hashid,
                            created_at: res.created_at,
                            url: res.url
                        }
                    ]

                    localStorage.setItem('links', JSON.stringify(links))
                }

            },
            error: function (err) {
                alert('something wrong happened.\n please enter a valid link and try again')
            }
        })
    })
    // handle copy link
    $('.link-list article button').on('click', handleCopyLink)
    // create link template for listing
    function makeLinkTemplate(originalLink, hashID) {
        return `
        <article class="card d-flex flex-sm-row justify-content-between align-items-sm-center p-0 mb-4">
            <span class="original-link  p-3">${originalLink}</span>
            <span class="d-block d-sm-flex justify-content-center align-items-center p-3">
                <a href="#" class="shortened-link" target="_blank">https://rel.ink/${hashID}</a>
                <button class="btn ml-sm-3 py-2 ">Copy</button>
            </span>
        </article>
        `
    }
    // handle copy link
    function handleCopyLink(e) {
        if ($(this).text() !== 'Copy') return false;

        linkText = document.querySelector("#link-text");
        linkText.value = $(this).siblings('a').text();
        linkText.select();
        linkText.setSelectionRange(0, 99999)
        document.execCommand("copy");


        $(this).text('Copied!')
        $(this).css({
            backgroundColor: 'hsl(257, 27%, 26%)'
        })
        setTimeout(() => {
            $(this).text('Copy')
            $(this).css({
                backgroundColor: 'hsl(180, 66%, 49%)'
            })
        }, 3000);
    }
})