const presence = new Presence({
	clientId: "743239699992281160"
});

// Timestamp
function getTimeStamp() {
	return Math.floor(Date.now() / 1000);
}

// Variables
let Routes: string[],
	Queries,
	DiscussionTitle: string,
	DiscussionAuthor: string,
	NewsTitle: string,
	PeopleName: string,
	TeamName: string,
	UserName: string,
	BookmarkType: string,
	BookmarkSize: string;

presence.on("UpdateData", async () => {
	// Presence Data
	const presenceData: PresenceData = {
		largeImageKey: "hentailib_large"
	};

	// Setup Routes & Query
	Routes = document.location.href
		.replace(document.location.search, "")
		.split("/")
		.splice(3);
	Queries = Object.fromEntries(
		document.location.search
			.slice(1)
			.split("&")
			.map((k, _, a) => {
				const item: string[] = k.replace(/\[(.*?)\]+/g, "").split("="),
					Keys = a
						.map(i => i.replace(/\[(.*?)\]+/g, "").split("="))
						.filter(i => i[0] === item[0]);

				if (Keys.length === 1) return item;
				else return [item[0], Keys.map(i => i[1])];
			})
	);

	// Website Pages
	if (Routes[0] === "") {
		// Homepage
		presenceData.smallImageText = "reading";
		presenceData.smallImageKey = "search";
		presenceData.details = "Главная";
		presenceData.startTimestamp = 0;

		// Page Section
		if (Queries.section === "my-updates") presenceData.state = "Мои обновления";
		else presenceData.state = "Все обновления";
	} else if (Routes[0] === "manga-list") {
		// List of mangas
		presenceData.smallImageText = "reading";
		presenceData.smallImageKey = "search";
		presenceData.details = "Каталог хентая";

		if (!Array.isArray(Queries.types)) Queries.types = [Queries.types];

		// Search Types
		if (Queries.types && Queries.types.length === 1) {
			// Types size === 1
			switch (Queries.types[0]) {
				case "1":
					presenceData.state = "Ищет Манги";
					break;
				case "4":
					presenceData.state = "Ищет OEL-мангу";
					break;
				case "5":
					presenceData.state = "Ищет Манхву";
					break;
				case "6":
					presenceData.state = "Ищет Маньхуа";
					break;
				case "8":
					presenceData.state = "Ищет Румангу";
					break;
				case "9":
					presenceData.state = "Ищет Западный комикс";
					break;
				default:
					presenceData.state = "Ищет Хентай";
					break;
			}
		} else if (Queries.types && Queries.types.length > 1) {
			// Types size > 1
			const mangas: string[] = [];

			Queries.types.sort().forEach((item: string) => {
				switch (item) {
					case "1":
						mangas.push("Манги");
						break;
					case "4":
						mangas.push("OEL-мангу");
						break;
					case "5":
						mangas.push("Манхву");
						break;
					case "6":
						mangas.push("Маньхуа");
						break;
					case "8":
						mangas.push("Румангу");
						break;
					case "9":
						mangas.push("Западный комикс");
						break;
					default:
						mangas.push("Хентай");
						break;
				}
			});

			presenceData.state = `Ищет: ${mangas.join(", ")}`;
		} else presenceData.state = "Ищет Хентай";
	} else if (Routes[0] === "forum") {
		// Forum page
		presenceData.details = "Форум";

		// Subpages of forums
		if (Routes[1] === "") {
			// Main forum page
			presenceData.smallImageText = "Читает";
			presenceData.smallImageKey = "reading";

			if (Queries.subscription) presenceData.state = "Мои подписки";

			if (Queries.user_id) presenceData.state = "Мои темы";

			switch (Queries.category) {
				case "all":
					presenceData.state = "Все категории";
					break;
				case "1":
					presenceData.state = "Баги и проблемы";
					break;
				case "2":
					presenceData.state = "Предложения для сайта";
					break;
				case "3":
					presenceData.state = "Поиск тайтлов";
					break;
				case "4":
					presenceData.state = "Поиск кадров";
					break;
				case "5":
					presenceData.state = "Обсуждение Манги";
					break;
				case "6":
					presenceData.state = "Обсуждение Аниме";
					break;
				case "7":
					presenceData.state = "Обсуждение Ранобэ";
					break;
				case "8":
					presenceData.state = "Видеоигры";
					break;
				case "9":
					presenceData.state = "Переводчикам";
					break;
				case "10":
					presenceData.state = "Как переводить мангу";
					break;
				case "11":
					presenceData.state = "Как рисовать мангу";
					break;
				case "12":
					presenceData.state = "Общение";
					break;
				case "13":
					presenceData.state = "Другое";
					break;
			}
		} else if (Routes[1] === "discussion-create") {
			// Discussion create
			presenceData.smallImageText = "Пишет";
			presenceData.smallImageKey = "writing";
			presenceData.state = "Создает новую тему";
		} else if (Routes[1] === "discussion") {
			// Discussion page
			if (Routes[2] && !Routes[3]) {
				// Opened discussion
				presenceData.smallImageText = "Читает";
				presenceData.smallImageKey = "reading";

				const titleElement = document.querySelector(
						".discussion .discussion__title"
					),
					authorElement = document.querySelector(
						".discussion .discussion-creator__username"
					);

				DiscussionTitle = titleElement && titleElement.textContent;
				DiscussionAuthor = authorElement && authorElement.textContent;

				if (DiscussionAuthor && DiscussionTitle)
					presenceData.state = `Тема: ${DiscussionTitle}| Автор: ${DiscussionAuthor}`;
			} else if (Routes[3] && Routes[3] === "edit") {
				// Editor discussion
				presenceData.smallImageText = "Пишет";
				presenceData.smallImageKey = "writing";

				presenceData.state = DiscussionTitle
					? `Редактирует тему: ${DiscussionTitle}`
					: "Редактирует тему";
			}
		}
	} else if (Routes[0] === "faq") {
		// Faq page

		if (Routes[1] === "article") {
			// Faq Editor

			presenceData.details = "Faq";
			presenceData.smallImageText = "Редактирует";
			presenceData.smallImageKey = "writing";
			presenceData.state = `Редактирует: ${Queries.article} вопрос`;
		} else {
			// Faq Sections
			presenceData.details = "Faq";
			presenceData.smallImageText = "Читает";
			presenceData.smallImageKey = "reading";

			switch (Queries.section) {
				case "1":
					presenceData.state = "Хентай";
					break;
				case "2":
					presenceData.state = "Общие вопросы";
					break;
				case "3":
					presenceData.state = "Профиль пользователя";
					break;
				case "4":
					presenceData.state = "Чтение хентая";
					break;
				case "5":
					presenceData.state = "Комментарии";
					break;
				case "6":
					presenceData.state = "Мини-чат";
					break;
				case "7":
					presenceData.state = "Решение проблем";
					break;
				case "8":
					presenceData.state = "Правила";
					break;
				case "9":
					presenceData.state = "Форум";
					break;
			}
		}
	} else if (Routes[0] === "news") {
		// News page
		presenceData.details = "Новости";
		presenceData.smallImageText = "Читает";
		presenceData.smallImageKey = "reading";

		if (Routes[1]) {
			// Opened News
			const titleElement = document.querySelector(".news__title");
			NewsTitle = titleElement && titleElement.textContent;

			if (NewsTitle) presenceData.state = NewsTitle;
		} else {
			// News List
			presenceData.details = "Новости";
			presenceData.smallImageText = "Читает";
			presenceData.smallImageKey = "reading";
			presenceData.state = "Список новостей";
		}
	} else if (Routes[0] === "notification") {
		// Notification list
		presenceData.details = "Уведомления";
		presenceData.smallImageText = "Читает";
		presenceData.smallImageKey = "reading";

		switch (Queries.type) {
			case "chapter":
				presenceData.state = "Главы";
				break;
			case "comments":
				presenceData.state = "Комментарии";
				break;
			case "message":
				presenceData.state = "Сообщения";
				break;
			case "friend":
				presenceData.state = "Заявки в друзья";
				break;
			case "other":
				presenceData.state = "Другое";
				break;
			case "all":
				presenceData.state = "Все";
				break;
		}
	} else if (Routes[0] === "contact-us") {
		// Contact page
		presenceData.details = "Контакты";
		presenceData.smallImageText = "Пишет";
		presenceData.smallImageKey = "writing";
		presenceData.state = "info@mangalib.me";
	} else if (Routes[0] === "messages") {
		// Messages page
		presenceData.details = "Личные сообщения";
		presenceData.smallImageText = "Пишет";
		presenceData.smallImageKey = "writing";
		presenceData.startTimestamp = getTimeStamp();
	} else if (Routes[0] === "people") {
		// Authors (Moderation) page

		if (Routes[1] === "create") {
			presenceData.details = "Добавляет автора";
			presenceData.smallImageText = "Добавляет автора";
			presenceData.smallImageKey = "writing";

			PeopleName = document.getElementById("name").textContent;

			if (PeopleName.length > 1) presenceData.state = PeopleName;
			else presenceData.state = "Имя автора не задано";
		}
	} else if (Routes[0] === "team") {
		// Team page

		if (Routes[1] === "create") {
			// Create New Team
			presenceData.details = "Добавляет команду";
			presenceData.smallImageText = "Добавляет команду";
			presenceData.smallImageKey = "writing";

			TeamName = document.getElementById("name").textContent;

			if (TeamName.length > 1) presenceData.state = TeamName;
			else presenceData.state = "Имя команды не задано";
		} else {
			// Others

			// eslint-disable-next-line no-lonely-if
			if (!Routes[2]) {
				// Main Team Page
				presenceData.details = "Команда перевода";
				presenceData.smallImageText = "Смотрит переводчика";
				presenceData.smallImageKey = "reading";

				const title = document.querySelector(".team-profile__name");

				TeamName = title && title.textContent.replace("редактировать", "");

				if (TeamName) presenceData.state = TeamName;
			} else if (Routes[2] === "edit") {
				presenceData.details = "Команда перевода";
				presenceData.smallImageText = "Редактирует переводчика";
				presenceData.smallImageKey = "writing";

				switch (Queries.section) {
					case "info":
						presenceData.state = "Редактирует информацию команды";
						break;
					case "users":
						presenceData.state = "Редактирует участников команды";
						break;
				}
			}
		}
	} else if (Routes[0] === "moderation") {
		// Moderation page

		presenceData.details = "Модерация";
		presenceData.smallImageText = "Управляет сайтом";
		presenceData.smallImageKey = "reading";

		if (!Routes[1]) presenceData.state = "Модерация глав";
		else if (Routes[1] === "manga") {
			if (Routes[2] === "rejected") presenceData.state = "Отклоненный хентай";
			else presenceData.state = "Модерация хентая";
		} else if (Routes[1] === "manga-edit")
			presenceData.state = "Изменения хентаев";
		else if (Routes[1] === "author") presenceData.state = "Новые Авторы";
		else if (Routes[1] === "publisher")
			presenceData.state = "Новые Издательства";
		else if (Routes[1] === "comments")
			presenceData.state = "Жалобы на комментарии";
		else if (Routes[1] === "forum-posts")
			presenceData.state = "Жалобы на форуме";
		else if (Routes[1] === "comments-list") {
			if (Routes[2] === "all") presenceData.state = "Список комментариев";
			else if (Routes[2] === "sticky")
				presenceData.state = "Закрепленные комментарии";
		} else if (Routes[1] === "ban-list") presenceData.state = "Баны";
		else if (Routes[1] === "other") presenceData.state = "Другое";
	} else if (Routes[0] === "user") {
		// User page
		presenceData.smallImageText = "Смотрит профиль пользователя";
		presenceData.smallImageKey = "reading";

		const username = document.querySelector(".profile-user__username span");

		UserName = username && username.textContent;

		if (UserName) presenceData.details = `Профиль:${UserName}`;

		if (Routes[1] === "content") {
			presenceData.details = "Мои добавления";
			presenceData.smallImageText = "Пишет";
			presenceData.smallImageKey = "writing";
			presenceData.startTimestamp = 0;

			if (!Routes[2]) presenceData.state = "Добавленные тайтлы";
			else if (Routes[2] === "moderation")
				presenceData.state = "Тайтлы на модерации";
			else if (Routes[2] === "rejected")
				presenceData.state = "Тайтлы не прошедшие модерацию";
			else if (Routes[2] === "chapters")
				presenceData.state = "Главы на модерации";
		} else if (Routes[1] === "edit") {
			presenceData.details = "Мои настройки";
			presenceData.smallImageText = "Настраивает";
			presenceData.smallImageKey = "writing";
			presenceData.startTimestamp = 0;

			switch (Queries.section) {
				case "info":
					presenceData.state = "Информация";
					break;
				case "site-settings":
					presenceData.state = "Настройки сайта";
					break;
				case "notifications":
					presenceData.state = "Уведомления";
					break;
				case "password":
					presenceData.state = "Безопасность";
					break;
			}
		} else if (!Routes[2]) {
			// Main user page
			const size = document.querySelector(
					".bookmark-menu .menu__item.is-active .bookmark-menu__label"
				),
				title = document.querySelector(
					".bookmark-menu .menu__item.is-active .bookmark-menu__name"
				);

			BookmarkSize = size && size.textContent;
			BookmarkType =
				title &&
				title.textContent.charAt(0).toUpperCase() + title.textContent.slice(1);

			presenceData.details = `Закладки ${UserName}`;
			presenceData.state = `${BookmarkType.trim()}: ${BookmarkSize}`;
			presenceData.smallImageText = "Читает";
			presenceData.smallImageKey = "reading";
			presenceData.startTimestamp = 0;
		} else if (Routes[2] === "comment") {
			presenceData.details = `Профиль: ${UserName}`;
			let commentType;

			if (Queries.comment_type === "manga")
				commentType = "Комментарии к хентаю";
			else if (Queries.comment_type === "chapter")
				commentType = "Комментарии к главам";
			else if (Queries.comment_type === "post")
				commentType = "Комментарии к новостям";
			else commentType = "Все комментарии";

			presenceData.state = commentType;
		} else if (Routes[2] === "following") {
			presenceData.details = `Профиль: ${UserName}`;
			presenceData.state = "Список друзей";
		} else if (Routes[2] === "mutual-friends") {
			presenceData.details = `Профиль: ${UserName}`;
			presenceData.state = "Общие друзья";
		} else if (Routes[2] === "ignore") {
			presenceData.details = `Профиль: ${UserName}`;
			presenceData.state = "Игнор-лист";
		} else if (Routes[2] === "ban") {
			presenceData.details = "Мой профиль";
			presenceData.state = "История банов";
		}
	} else if (Routes[0] === "manga") {
		// Manga page

		if (Routes[1] === "create") {
			// create new manga
			presenceData.details = "Добавляет хентай";
			presenceData.smallImageText = "Пишет";
			presenceData.smallImageKey = "writing";

			const title = <HTMLInputElement>document.getElementById("rus_name");

			if (title.textContent.length > 1) presenceData.state = title.value;
			else presenceData.state = "Имя хентая не задано";
		} else if (Routes[2] === "edit") {
			// edit
			presenceData.smallImageText = "Редактирует";
			presenceData.smallImageKey = "writing";

			const title = document.querySelector(".section__header .breadcrumb a");

			presenceData.details = title.textContent;

			switch (Queries.section) {
				case "media-edit":
					presenceData.state = "Редактирование";
					break;
				case "changes":
					presenceData.state = "Список изменений";
					break;
				case "related-items":
					presenceData.state = "Связанные тайтлы";
					break;
			}
		} else if (Routes[2] === "bulk-create") {
			// bulk create
			presenceData.details = "Добавляет главы";
			presenceData.smallImageText = "Добавляет";
			presenceData.smallImageKey = "uploading";

			const title = document.querySelector(".section__header .breadcrumb a");

			presenceData.state = `Ранобэ: ${title.textContent}`;
		} else if (Routes[2] === "add-chapter") {
			// add chapter
			presenceData.details = "Добавляет главу";
			presenceData.smallImageText = "Добавляет";
			presenceData.smallImageKey = "uploading";

			const title = document.querySelector(".section__header .breadcrumb a");

			presenceData.state = `Ранобэ: ${title.textContent}`;
		} else {
			presenceData.details = "Редактирует главу";
			presenceData.smallImageText = "Пишет";
			presenceData.smallImageKey = "writing";

			const title = document.querySelector(".section__header .breadcrumb a");

			presenceData.state = `Ранобэ: ${title.textContent}`;
		}
	} else if (document.querySelector(".reader")) {
		presenceData.details = "Читает хентай";
		presenceData.state = document.title.split(" ").slice(2, -4).join(" ");
		presenceData.smallImageText = "Читает";
		presenceData.smallImageKey = "reading";
		presenceData.startTimestamp = getTimeStamp();
	} else {
		const { title } = document;

		presenceData.details = "Смотрит хентай";
		presenceData.state = title.split("/")[0].split(" ").slice(1).join(" ");
		presenceData.smallImageText = "Читает";
		presenceData.smallImageKey = "reading";
	}

	presence.setActivity(presenceData, true);
});
