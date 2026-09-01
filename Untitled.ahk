#Requires AutoHotkey v2.0

^q::
{
    CoordMode "Mouse", "Screen"

    Loop
    {
        Click 1860, 500
        Sleep 3000

        Click 1500, 500
        Sleep 200

        Click 1500, 330
        Sleep 6000

        Click 1650, 500
        Sleep 12000

        Click 1450, 50
        Sleep 2000

        Click 1500, 340
        Sleep 7000

        Click 1500, 340

        ; Wait 1 minute before repeating
        Sleep 35000
    }
}

Esc::ExitApp