const settingsButton = document.querySelector(".settings-button");
      const settings = document.querySelector(".settings");
      const saveButton = document.querySelector(".btn");
      const webhookUrlInput = document.querySelector("#webhookUrl");
      const usernameInput = document.querySelector("#username");
      const avatarUrlInput = document.querySelector("#avatarUrl");
      const pfpImg = document.querySelector(".pfp");
      const usernameSpan = document.querySelector(".username");



      settingsButton.addEventListener("click", () => {
        settings.classList.toggle("show");
      });

      saveButton.addEventListener("click", (event) => {
        event.preventDefault();
        localStorage.setItem("webhookUrl", webhookUrlInput.value);
        localStorage.setItem("username", usernameInput.value);
        localStorage.setItem("avatarUrl", avatarUrlInput.value);
        pfpImg.src = avatarUrlInput.value;
        usernameSpan.textContent = usernameInput.value;
        alert("Settings saved!");
      });

      function autoResize(textarea) {
        textarea.style.height = "1px";
        textarea.style.marginTop = "0";

        textarea.style.height = textarea.scrollHeight + "px";
        var marginTop = textarea.offsetHeight - textarea.clientHeight;
        textarea.style.marginTop = -marginTop + "px";
      }

      function moveWrittenLinesUp() {
        const textarea = document.getElementById("myTextarea");
        const text = textarea.value;
        const lines = text.split("\n");
        textarea.value = lines.join("\n");
      }

      $(document).ready(function () {
        // Load saved input values on page load
        $("#webhookUrl").val(localStorage.getItem("webhookUrl"));
        $("#username").val(localStorage.getItem("username"));
        $("#avatarUrl").val(localStorage.getItem("avatarUrl"));

        // Send message via webhook on enter key press
        $("#message").keydown(function (event) {
          if (event.keyCode === 13 && !event.shiftKey) {
            // Enter key pressed
            event.preventDefault();
            var webhookUrl = $("#webhookUrl").val();
            var username = $("#username").val();
            var avatarUrl = $("#avatarUrl").val();
            var message = $("#message").val();
            // Construct payload object
            var payload = {
              username: username,
              avatar_url: avatarUrl,
              content: message,
            };
            // Send payload to webhook URL
            $.ajax({
              type: "POST",
              url: webhookUrl,
              data: JSON.stringify(payload),
              contentType: "application/json",
              success: function () {
                alert("Message sent!");
                $("#message").val("");
              },
              error: function () {
                alert("Error sending message.");
              },
            });
          }
        });

        // Allow shift+enter for new lines in message input field
        $("#message").keydown(function (event) {
          if (event.keyCode === 13 && event.shiftKey) {
            // Shift+Enter key pressed
            var content = this.value;
            var caret = getCaret(this);
            this.value =
              content.substring(0, caret) + "\n" + content.substring(caret);
            event.preventDefault();
          }
        });
      });

      // Get caret position in input field
      function getCaret(el) {
        if (el.selectionStart) {
          return el.selectionStart;
        } else if (document.selection) {
          el.focus();
          var r = document.selection.createRange();
          if (r == null) {
            return 0;
          }
          var re = el.createTextRange(),
            rc = re.duplicate();
          re.moveToBookmark(r.getBookmark());
          rc.setEndPoint("EndToStart", re);
          return rc.text.length;
        }
        return 0;
      }