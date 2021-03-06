# -*- coding: utf-8 -*-
#
# Copyright (C) Pootle contributors.
#
# This file is a part of the Pootle project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

import json

import pytest

from pootle_app.models.permissions import check_user_permission
from pootle_store.util import find_altsrcs
from pootle_store.views import get_alt_src_langs


@pytest.mark.django_db
def test_get_edit_unit(project0_nongnu, get_edit_unit, client,
                       request_users, settings):
    user = request_users["user"]
    if user.username != "nobody":
        client.login(
            username=user.username,
            password=request_users["password"])
    unit = get_edit_unit
    store = unit.store
    filetype = unit.store.filetype.name
    directory = store.parent
    translation_project = store.translation_project
    project = translation_project.project
    language = translation_project.language

    response = client.get(
        "/xhr/units/%s/edit/" % unit.id,
        HTTP_X_REQUESTED_WITH='XMLHttpRequest')
    request = response.wsgi_request
    result = json.loads(response.content)

    src_lang = unit.store.translation_project.project.source_language
    alt_src_langs = get_alt_src_langs(request, user, translation_project)
    altsrcs = find_altsrcs(unit, alt_src_langs, store=store, project=project)
    altsrcs = {x.id: x.data for x in altsrcs}
    sources = {altsrcs[x]['language_code']: altsrcs[x]['target'] for x in altsrcs}
    sources[src_lang.code] = unit.source

    assert result["is_obsolete"] is False
    assert result["sources"] == sources
    assert response.context["unit"] == unit
    assert response.context["priority"] == unit.priority
    assert response.context["store"] == store
    assert response.context["filetype"] == filetype
    assert response.context["directory"] == directory
    assert response.context["project"] == project
    assert response.context["language"] == language
    assert response.context["source_language"] == src_lang
    assert response.context["altsrcs"] == altsrcs

    assert response.context["cantranslate"] == check_user_permission(
        user, "translate", directory)
    assert response.context["cansuggest"] == check_user_permission(
        user, "suggest", directory)
    assert response.context["canreview"] == check_user_permission(
        user, "review", directory)
    assert response.context["has_admin_access"] == check_user_permission(
        user, "administrate", directory)
