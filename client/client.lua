PlayerData = {}
isLoggedIn, inVehicle, driverSeat, Show, phoneOpen = false, false, false, false, false
playerPed, vehicle, vehicleClass, Fuel, vehicleClass = 0, 0, 0, 0, 0

local QBCore = exports['qb-core']:GetCoreObject()

local bigMap = false
local onMap = false
local minimap = nil
local hunger = 100
local thirst = 100
local prevPlayerStats = {}

RegisterNetEvent('hud:client:UpdateNeeds', function(newHunger, newThirst)
    hunger = newHunger
    thirst = newThirst
    SendNUIMessage({
        action = "HungerUpdate",
        hunger = hunger
    })
    SendNUIMessage({
        action = "ThirstUpdate",
        thirst = thirst
    })
end)

local function updatePlayerHud(data)
    local shouldUpdate = false
    for k, v in pairs(data) do
        if prevPlayerStats[k] ~= v then
            shouldUpdate = true
            break
        end
    end
    prevPlayerStats = data
    if shouldUpdate then
        SendNUIMessage({
            action = 'hudtick',
            show = data[1],
            health = data[10],
            playerDead = data[11],
            armor = data[12],
            thirst = data[13],
            hunger = data[14],
            stress = data[15],
            oxygen = data[20],
            parachute = data[21],
            nos = data[22],
            cruise = data[23],
            nitroActive = data[24],
            harness = data[25],
            hp = data[26],
            speed = data[27],
            engine = data[28],
            cinematic = data[29],
            dev = data[30],
            radioActive = data[31],
        })
    end
end

Citizen.CreateThread(function()
    while true do
        playerPed = PlayerPedId()
        inVehicle = false
        if IsPedInAnyVehicle(playerPed, false) then
            vehicle = GetVehiclePedIsIn(playerPed, false)
            vehicleClass = GetVehicleClass(vehicle)
            inVehicle = not IsVehicleModel(vehicle, `wheelchair`) and vehicleClass ~= 13 and not IsVehicleModel(vehicle, `windsurf`)
            driverSeat = GetPedInVehicleSeat(vehicle, -1) == playerPed
            Fuel = GetVehicleFuelLevel(vehicle)
        end
        SendNUIMessage({
            type = 'tick',
            heal = (GetEntityHealth(playerPed) - 100),
            armor = GetPedArmour(playerPed),
            stamina = 100 - GetPlayerSprintStaminaRemaining(PlayerId()),
            oxy = IsPedSwimmingUnderWater(playerPed) and GetPlayerUnderWaterTimeRemaining(PlayerId()) or 100,
            thirst = thirst,
            hunger = hunger,
            vehicle = inVehicle,
            phoneOpen = phoneOpen
        })
        Citizen.Wait(200)
    end
end)

RegisterCommand("hud", function()
    SendNUIMessage({type = 'hudmenu'})
    SetNuiFocus(true, true)
end, false)


RegisterCommand("fulle", function()
    TriggerEvent('tgiann-hud:fulle')
    QBCore.Functions.Notify("fulledim", "success",3000)
end, false)

RegisterNUICallback("hudmenuclose", function()
    SetNuiFocus(false, false)
end)

RegisterNUICallback('hudac', function()
    TriggerEvent("tgiann-hud:ui", true)
end)

RegisterNUICallback('hudkapa', function()
    TriggerEvent("tgiann-hud:ui", false)
end)

RegisterNUICallback('emotechat', function(data)
    TriggerEvent("3dme-chat", data.onOff)
end)

local miniMapUi = false
function UIStuff()
    Citizen.CreateThread(function()
        while Show do
            Citizen.Wait(0)

            if inVehicle and not onMap then
                SetPedConfigFlag(playerPed, 35, false)
                onMap = true
                DisplayRadar(true)
                 circleMap()
            elseif not inVehicle and onMap then
                onMap = false
                DisplayRadar(false)
                 circleMap()
            end

            BeginScaleformMovieMethod(minimap, "SETUP_HEALTH_ARMOUR")
            ScaleformMovieMethodAddParamInt(3)
            EndScaleformMovieMethod()

            if IsPauseMenuActive() then
                if miniMapUi then
                    SendNUIMessage({type = "ui", show = false})
                    miniMapUi = false
                end
            elseif not IsPauseMenuActive() then
                if not miniMapUi then
                    SendNUIMessage({type = "ui", show = true})
                    miniMapUi = true
                end
            end
        end
        onMap = false
    end)
end

function circleMap()
     RequestStreamedTextureDict("circlemap", false)
     while not HasStreamedTextureDictLoaded("circlemap") do
         Wait(100)
     end

     AddReplaceTexture("platform:/textures/graphics", "radarmasksm", "circlemap", "radarmasksm")

     SetMinimapClipType(1)
     SetMinimapComponentPosition("minimap", "L", "B", 0.025, -0.03, 0.153, 0.30)
     SetMinimapComponentPosition("minimap_mask", "L", "B", 0.135, 0.12, 0.093, 0.164)
     SetMinimapComponentPosition("minimap_blur", "L", "B", 0.012, 0.022, 0.256, 0.337)
     SetBlipAlpha(GetNorthRadarBlip(), 0)

     minimap = RequestScaleformMovie("minimap")
    SetRadarBigmapEnabled(true, false)
    Citizen.Wait(100)
    SetRadarBigmapEnabled(false, false)
end


RegisterCommand('hudyenile', function()
    QBCore.PlayerData = QBCore.Functions.GetPlayerData()
    TriggerEvent("hud:client:SetMoney")
    SendNUIMessage({action = 'first'})
    UIStuff()
    isLoggedIn = true
    Show = true
    Citizen.Wait(10000)
end)

RegisterNetEvent('QBCore:Client:OnPlayerLoaded')
AddEventHandler('QBCore:Client:OnPlayerLoaded', function()
    QBCore.PlayerData = QBCore.Functions.GetPlayerData()
    TriggerEvent("hud:client:SetMoney")
    SendNUIMessage({action = 'first'})
    UIStuff()
    isLoggedIn = true
    Show = true
    Citizen.Wait(10000)
end)

function firstLogin()
    QBCore.PlayerData = QBCore.Functions.GetPlayerData()
    TriggerEvent("hud:client:SetMoney")
    UIStuff()
    isLoggedIn = true
    Show = true
    TriggerEvent("tgian-hud:load-data")
end

RegisterNetEvent('tgiann-hud:ui')
AddEventHandler('tgiann-hud:ui', function(open)
    if open then 
        UIStuff()
        Show = true
        SendNUIMessage({action = 'ui', show = true})
    else
        Show = false
        SendNUIMessage({action = 'ui', show = false})
        DisplayRadar(false)
    end
end)

RegisterNetEvent('tgiann-hud:siyahBar') -- Siyah bar
AddEventHandler('tgiann-hud:siyahBar', function(data)
    if data == true then
        SendNUIMessage({action = 'siyahBar', acik = true})
    else
        SendNUIMessage({action = 'siyahBar', acik = false})
        
    end
end)

RegisterNetEvent('tgiann-hud:open-hud')
AddEventHandler('tgiann-hud:open-hud', function()
    if not Show then
        PlayerData = QBCore.Functions.GetPlayerData()
        TriggerEvent("tgian-hud:load-data")
        SendNUIMessage({action = 'showui'})
        UIStuff()
        isLoggedIn = true
        Show = true
    end
    SetNuiFocus(true, true)
    SendNUIMessage({action = 'showMenu'})
end)

RegisterNUICallback('close-ayar-menu', function()
    SetNuiFocus(false, false)
end)

local disSes = false
Citizen.CreateThread(function()
    RegisterKeyMapping('+raidoSpeaker', 'Telsiz Hoparlör Modu', 'keyboard', 'F5')
end)

RegisterCommand("+raidoSpeaker", function()
    disSes = not disSes
    TriggerServerEvent("ls-radio:set-disses", disSes)
    SendNUIMessage({action = 'disSes', disSes = disSes})
end, false)

RegisterNUICallback('set-emotechat', function(data)
    TriggerEvent("3dme-chat", data.status)
end)

RegisterNetEvent('tgiann-hud:parasut')
AddEventHandler('tgiann-hud:parasut', function()
	GiveWeaponToPed(playerPed, `gadget_parachute`, 1, false, false)
	SetPedComponentVariation(playerPed, 5, 8, 3, 0)
end)

RegisterNetEvent('phone:open')
AddEventHandler('phone:open', function(bool)
    phoneOpen = bool
    if not phoneOpen then Citizen.Wait(500) end
    SendNUIMessage({action = 'phone', phoneOpen = phoneOpen})
end)

CreateThread(function()
	SendNUIMessage({
		action = "UsingVoiceHud"
	})
end)

local Talking = false
Citizen.CreateThread(function()
	while true do
		if NetworkIsPlayerTalking(PlayerId()) then
			if not Talking then
				Talking = true
				SendNUIMessage({
					action = "talking"
				})
			end
		else
			if Talking then
				Talking = false
				SendNUIMessage({
					action = "Nottalking"
				})
			end
		end
		Citizen.Wait(200)
	end
end)

RegisterNetEvent('pma-voice:setTalkingMode')
AddEventHandler('pma-voice:setTalkingMode', function(voiceMode)
	SendNUIMessage({
		action = "pmavoice",
		value = voiceMode
	})
end)

RegisterNetEvent('hud:client:UpdateNeeds', function(newHunger, newThirst)
    hunger = newHunger
    thirst = newThirst
end)

Citizen.CreateThread(function()
    while true do
        local sleep = 500
        SendNUIMessage({
            action = "HungerUpdate",
            hunger = hunger
        })
        SendNUIMessage({
            action = "ThirstUpdate",
            thirst = thirst
        })
        Citizen.Wait(sleep)
    end
end)